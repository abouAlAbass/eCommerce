using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _contex;

        public BuggyController(StoreContext contex)
        {
            _contex = contex;
        }
      [HttpGet("notfound")]
      public ActionResult GetNotFoundRequest()
        {
            var thing = _contex.Products.Find(62);
            if (thing == null)
            {
                return NotFound(new ApiResponse(404));
            }
            return Ok();
        }
        [HttpGet("servererror")]
      public ActionResult GetServerErrorRequest()
      {
            var thing = _contex.Products.Find(62);
            var thingToReturn = thing.ToString();
            return Ok();
      }  
        [HttpGet("badrequest")]
      public ActionResult GetBadRequestRequest()
        {
            
            return BadRequest(new ApiResponse(400));
        }  
        [HttpGet("badrequest/{id}")]
      public ActionResult GetNotFoundRequest(int id)
        {
            return Ok();
        }
    }
}
