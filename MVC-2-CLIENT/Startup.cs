using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MVC_2_CLIENT.Startup))]
namespace MVC_2_CLIENT
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
