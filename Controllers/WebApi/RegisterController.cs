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
    //api/Register
    [Route("api/[controller]")]
    public class RegisterController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public RegisterController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // ********************************************************
        // Register

        // api/Register
        #region public IActionResult Index([FromBody]RegisterDTO Register)
        [HttpPost]
        [AllowAnonymous]
        public IActionResult Index([FromBody]RegisterDTO Register)
        {
            // RegisterStatus to return
            RegisterStatus objRegisterStatus = new RegisterStatus();
            objRegisterStatus.status = "Registration Failure";
            objRegisterStatus.isSuccessful = false;

            // Get values passed
            var paramUserName = Register.userName.Trim();
            var paramPassword = Register.password.Trim();
            var paramFirstName = Register.firstName.Trim();
            var paramLastName = Register.lastName.Trim();
            var paramEmail = Register.email.Trim();

            // Validation ****************************

            EmailValidation objEmailValidation = new EmailValidation();
            if (!objEmailValidation.IsValidEmail(paramEmail))
            {
                objRegisterStatus.status = "This Email is not valid.";
                objRegisterStatus.isSuccessful = false;
                return Ok(objRegisterStatus);
            }

            if ((paramUserName == null) || (paramUserName.Length < 1))
            {
                objRegisterStatus.status = "This Username is not long enough.";
                objRegisterStatus.isSuccessful = false;
                return Ok(objRegisterStatus);
            }

            // Create Account ****************************

            try
            {
                var user = new ApplicationUser { UserName = paramUserName, Email = paramEmail };
                var result = _userManager.CreateAsync(user, paramPassword).Result;

                if (result.Succeeded)
                {
                    // Sign the User in
                    var SignInResult = _signInManager.PasswordSignInAsync(
                        paramUserName, paramPassword, false, lockoutOnFailure: false).Result;

                    if (!SignInResult.Succeeded)
                    {
                        // Return the error
                        objRegisterStatus.status = $"Could not sign user {paramUserName} in.";
                        objRegisterStatus.isSuccessful = false;
                        return Ok(objRegisterStatus);
                    }
                }
                else
                {
                    // Create user failed
                    // Return the errors from the Memberhip API Creation
                    string strErrors = "";
                    foreach (var Error in result.Errors)
                    {
                        strErrors = strErrors + "\n" + Error.Description;
                    }

                    objRegisterStatus.status = strErrors;
                    objRegisterStatus.isSuccessful = false;
                    return Ok(objRegisterStatus);
                }

                objRegisterStatus.status = "Success";
                objRegisterStatus.isSuccessful = true;

                return Ok(objRegisterStatus);
            }
            catch (Exception ex)
            {
                objRegisterStatus.status = ex.Message;
                objRegisterStatus.isSuccessful = false;

                return Ok(objRegisterStatus);
            }
        }
        #endregion
    }
}
