// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// The same code for the controller is used in both chapters of the tutorial. 
// In the first chapter this is just a protected API (ENABLE_OBO is not set)
// In this chapter, the Web API calls a downstream API on behalf of the user (OBO)
#define ENABLE_OBO
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using ProfileAPI.Models;
using ProfileAPI.Utils;


namespace ProfileAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        /// <summary>
        /// The Web API will only accept tokens 1) for users, and 
        /// 2) having the access_as_user scope for this API
        /// </summary>
        static readonly string[] scopeRequiredByApi = new string[] { "access_as_user" };

        private readonly ProfileContext _context;
        private readonly ITokenAcquisition _tokenAcquisition;

        public ProfileController(ProfileContext context, ITokenAcquisition tokenAcquisition)
        {
            _context = context;
            _tokenAcquisition = tokenAcquisition;
        }

        // GET: api/profile
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProfileItem>>> GetProfileItems()
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);
            string owner = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return await _context.ProfileItems.Where(item => item.Owner == owner).ToListAsync();
        }

        // GET: api/ProfileItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProfileItem>> GetProfileItem(int id)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var profileItem = await _context.ProfileItems.FindAsync(id);

            if (profileItem == null)
            {
                return NotFound();
            }

            return profileItem;
        }

        // POST api/values
        [HttpPost]
        public async Task<ActionResult<ProfileItem>> PostProfileItem(ProfileItem profileItem)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            profileItem.Owner = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            profileItem.Id = new Random().Next();
            profileItem.FirstLogin = false;

#if ENABLE_OBO
            // This is a synchronous call, so that the clients know, when they call Get, that the 
            // call to the downstream API (Microsoft Graph) has completed.
            try
            {
                var profile = CallGraphApiOnBehalfOfUser("getMe").GetAwaiter().GetResult();

                profileItem.UserId = profile.Id;
                profileItem.UserPrincipalName = profile.UserPrincipalName;
                profileItem.GivenName = profile.GivenName;
                profileItem.Surname = profile.Surname;
                profileItem.JobTitle = profile.JobTitle;
                profileItem.MobilePhone = profile.MobilePhone;
                profileItem.PreferredLanguage = profile.PreferredLanguage;
            }
            catch (MsalException ex)
            {
                HttpContext.Response.ContentType = "text/plain";
                HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await HttpContext.Response.WriteAsync("An authentication error occurred while acquiring a token for downstream API\n" + ex.ErrorCode + "\n" + ex.Message);
            }
            catch (Exception ex)
            {
                HttpContext.Response.ContentType = "text/plain";
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await HttpContext.Response.WriteAsync("An error occurred while calling the downstream API\n" + ex.Message);
            }
#endif

            _context.ProfileItems.Add(profileItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProfileItem", new { id = profileItem.Id }, profileItem);
        }



        // PUT: api/ProfileItems/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchProfileItem(int id, ProfileItem profileItem)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            if (id != profileItem.Id)
            {
                return BadRequest();
            }

            //_context.ProfileItems.Attach(profileItem);
            _context.Entry(profileItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfileItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ProfileItems/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ProfileItem>> DeleteProfileItem(int id)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var profileItem = await _context.ProfileItems.FindAsync(id);
            if (profileItem == null)
            {
                return NotFound();
            }

            _context.ProfileItems.Remove(profileItem);
            await _context.SaveChangesAsync();

            return profileItem;
        }

        private bool ProfileItemExists(int id)
        {
            return _context.ProfileItems.Any(e => e.Id == id);
        }

        public async Task<dynamic> CallGraphApiOnBehalfOfUser(string operation)
        {
            string[] scopes = { "User.Read" };

            // we use MSAL.NET to get a token to call the API On Behalf Of the current user
            try
            {
                string accessToken = await _tokenAcquisition.GetAccessTokenForUserAsync(scopes);
                GraphHelper.Initialize(accessToken);
                User me;

                switch (operation) 
                {
                    case "getMe":
                        me = await GraphHelper.GetMeAsync();
                        dynamic getMe = me;
                    
                        return getMe;

                    default:
                        break;

                }
            }
            catch (MsalUiRequiredException ex)
            {
                _tokenAcquisition.ReplyForbiddenWithWwwAuthenticateHeader(scopes, ex);
                return null;
            }

            return null;
        }
    }
}
