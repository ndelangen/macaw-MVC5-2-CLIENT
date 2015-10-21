using MVC_2_CLIENT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVC_2_CLIENT.Controllers
{
    public class ModuleController : Controller
    {
        [ChildActionOnly]
        public ActionResult Index(ModuleModel m)
        {
            return View(m);
            return (m.RenderingMode == "editing") ? Editing(m) : Base(m);
        }


        public ActionResult Base(ModuleModel model)
        {
            return View(model);
        }

        public ActionResult Editing(ModuleModel model)
        {
            return View(model);
        }
    }
}