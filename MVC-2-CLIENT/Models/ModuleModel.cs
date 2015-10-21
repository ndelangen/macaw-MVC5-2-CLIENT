using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MVC_2_CLIENT.Models
{
    public class ModuleModel: ModuleBase
    {
        public string Title { get; set; }
        public IEnumerable<string> Tags { get; set; }
    }
}