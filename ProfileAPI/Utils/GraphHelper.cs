using System.Threading.Tasks;
using System.Net.Http.Headers;
using Microsoft.Graph;

namespace ProfileAPI.Utils
{
    public class GraphHelper
    {
        private static GraphServiceClient graphClient;
        public static void Initialize(string accessToken)
        {
            graphClient = new GraphServiceClient(new DelegateAuthenticationProvider((requestMessage) =>
            {
                requestMessage
                    .Headers
                    .Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                return Task.FromResult(0);
            }));
        }

        public static async Task<User> GetMeAsync()
        {

            try
            {
                // GET /me
                return await graphClient.Me.Request().GetAsync();
            }
            catch (ServiceException)
            {
                return null;
            }
        }
    }
}
