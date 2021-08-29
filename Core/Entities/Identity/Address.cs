using System.ComponentModel.DataAnnotations;

namespace Core.Entities.Identity
{
    public class Address
    {
        public int Id { get; set; }
        public string CodeState { get; set; }
        
        public string City { get; set; }
        public string Street { get; set; }
        public string ZipCode { get; set; }
        [Required]
        public string AppUserID { get; set; }
        public AppUser AppUser { get; set; }
    }
}