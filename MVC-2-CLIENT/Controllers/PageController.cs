using MVC_2_CLIENT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVC_2_CLIENT.Controllers
{
    public class PageController : Controller
    {
        // GET: Test
        public ActionResult Index(string mode = "base")
        {
            var model = new PageModel()
            {
                MyProperty = "KOEIEHOL",
                Module = new ModuleModel()
                {
                    Title = "Hallo",
                    Tags = new List<string> { "Blaat", "Foo" },
                    RenderingMode = mode

                }

            };

            return View(model);
        }

    }
}