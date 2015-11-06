using System.Web;
using System.Web.Optimization;

namespace MVC_2_CLIENT
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Assets/bundles/js").Include(
                "~/Assets/js/core/x-tag-core.min.js",
                "~/Assets/js/core/lowdash.custom.modern.js",
				"~/Assets/js/core/x-features.js",
				"~/Assets/js/core/x-viewport.js",
				"~/Assets/js/core/x-variants.js",
				"~/Assets/js/modules/*.js"));

            bundles.Add(new StyleBundle("~/Assets/bundles/css").Include(
                "~/Assets/css/*.css"));
        }
    }
}
