using Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.Config
{
    public abstract class WWSControllerBase : ControllerBase
    {
        protected UserMetaData getUserMetaData() => (UserMetaData)HttpContext?.Items["User"];
    }
}
