using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiResponse
    {
        public int StatusCode { get; set; }
        public string  Message { get; set; }
        public ApiResponse(int statusCode,string message=null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageFromStatusCode(statusCode);
        }

        private string GetDefaultMessageFromStatusCode(int statusCode)
        {
            return statusCode switch
            {
                400 => "A bad request ,you have made",
                401 => "Authorized, you are not",
                404 => "Resouce found, it was not",
                500 => "Errors, are the pathe of dark side",
                _ => null
            };
        }
    }
}
