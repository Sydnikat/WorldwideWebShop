using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.UserClient.DTOs
{
    public class UserResponse
    {
        public UserResponse()
        {
        }

        public UserResponse(Guid id, string userName, string userFullName, string email, AddressResponse address, string phone)
        {
            Id = id;
            UserName = userName;
            UserFullName = userFullName;
            Email = email;
            Address = address;
            Phone = phone;
        }

        [JsonProperty(PropertyName = "id")]
        public Guid Id { get; set; } = Guid.Empty;

        [JsonProperty(PropertyName = "userName")]
        public string UserName { get; set; } = "";

        [JsonProperty(PropertyName = "userFullName")]
        public string UserFullName { get; set; } = "";

        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; } = "";

        [JsonProperty(PropertyName = "address")]
        public AddressResponse Address { get; set; } = new AddressResponse();

        [JsonProperty(PropertyName = "phone")] 
        public string Phone { get; set; } = "";
    }
}
