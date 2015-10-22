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
        public ActionResult Index(ModuleModel model)
        {
            model.Guid = Guid.NewGuid();
            
            return (model.RenderMode == "editing") ? Editing(model) : Base(model);
        }


        public ActionResult Base(ModuleModel model)
        {
            return View("Base", model);
        }

        public ActionResult Editing(ModuleModel model)
        {
            return View("Editing", model);
        }
    }
}