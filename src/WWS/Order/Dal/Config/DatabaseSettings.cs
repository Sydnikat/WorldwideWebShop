using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Config
{
    public class DatabaseSettings : IDatabaseSettings
    {
        public string MSSQLConnection { get; set; }
    }

    public interface IDatabaseSettings
    {
        public string MSSQLConnection { get; set; }
    }
}
