//
// ADefwebserver.com
// Copyright (c) 2017
// by Michael Washington
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions 
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
// TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.
//
//
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DotNetComplete.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.Security.Cryptography;
using System.Text;
using DotNetComplete.Data;

namespace DotNetComplete.Controllers
{
    //api/Login
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public LoginController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // ********************************************************
        // Login

        // api/Login
        #region public IActionResult CurrentUser()
        [HttpGet]
        [AllowAnonymous]
        public IActionResult CurrentUser()
        {
            // User to return
            User objUser = new User();

            // See if the user is logged in
            if (this.User.Identity.IsAuthenticated)
            {
                // They are logged in
                objUser.userName = this.User.Identity.Name;
                objUser.isLoggedIn = true;
            }
            else
            {
                // They are not logged in
                objUser.userName = "Not Logged in";
                objUser.isLoggedIn = false;
            }

            // Return the result
            return Ok(objUser);
        }
        #endregion

        // (POST) api/Login 
        #region public IActionResult Index([FromBody]DTOAuthentication Authentication)
        [HttpPost]
        [AllowAnonymous]
        public IActionResult Index([FromBody]DTOAuthentication Authentication)
        {
            // LoginStatus to return
            LoginStatus objLoginStatus = new LoginStatus();
            objLoginStatus.isLoggedIn = false;

            // Get values passed
            var paramUserName = Authentication.userName;
            var paramPassword = Authentication.password;

            if ((paramUserName != null) && (paramPassword != null))
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = _signInManager.PasswordSignInAsync(paramUserName, paramPassword, false, lockoutOnFailure: false).Result;

                if (result.Succeeded)
                {
                    objLoginStatus.status = "Success";
                    objLoginStatus.isLoggedIn = true;
                    return Ok(objLoginStatus);
                }
                if (result.RequiresTwoFactor)
                {
                    objLoginStatus.status = "RequiresVerification";
                    return Ok(objLoginStatus);
                }
                if (result.IsLockedOut)
                {
                    objLoginStatus.status = "IsLockedOut";
                    return Ok(objLoginStatus);
                }
            }

            objLoginStatus.status = "Authentication Failure";

            return Ok(objLoginStatus);
        }
        #endregion
    }
}
