﻿using Domain.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public interface INotificationService
    {
        Task PublishOrderCreatedEvent(Order order);
    }
}
