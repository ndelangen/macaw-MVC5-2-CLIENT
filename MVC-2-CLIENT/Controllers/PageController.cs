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
                MyProperty = "Page Property 1",
                Module = new ModuleModel()
                {
                    Title = "Module Title",
                    Tags = new List<string> { "ModuleTag1", "ModuleTag2" },

                    RenderMode = mode
                }

            };

            return View("Index", model);
        }

    }
}