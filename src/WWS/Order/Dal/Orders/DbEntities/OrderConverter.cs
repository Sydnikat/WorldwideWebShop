﻿using Common;
using Dal.OrderItems.DbEntites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Orders.DbEntities
{
    public static class OrderConverter
    {
        public static Func<Order, Domain.Orders.Order> ToDomain => order
            => new Domain.Orders.Order(
                id: order._id,
                orderCode: order.OrderCode,
                customerId: order.CustomerId,
                customerName: order.CustomerName,
                totalPrice: order.TotalPrice,
                items: order.Items.ToDomainOrNull(OrderItemConverter.ToDomain).ToList(),
                created: order.Created,
                state: order.State.ToDomain(),
                zip: order.Zip,
                street: order.Street,
                city: order.City,
                countryCode: order.CountryCode,
                email: order.Email,
                phone: order.Phone
                );

        public static Func<Domain.Orders.Order, Order> ToDalNew => order =>
        {
            var entity = new Order(
                id: 0,
                orderCode: order.OrderCode,
                customerId: order.CustomerId,
                customerName: order.CustomerName,
                totalPrice: order.TotalPrice,
                items: new List<OrderItem>(),
                created: order.Created,
                state: Order.OrderState.InProgress,
                zip: order.Zip,
                street: order.Street,
                city: order.City,
                countryCode: order.CountryCode,
                email: order.Email,
                phone: order.Phone
                );

            entity.Items = order.Items.Select(i => i.ToDalOrNull(OrderItemConverter.ToDalNew)).ToList();

            return entity;
        };

        public static Func<Domain.Orders.Order, Order> ToDal => order =>
        {
            var entity = new Order(
                id: order.Id,
                orderCode: order.OrderCode,
                customerId: order.CustomerId,
                customerName: order.CustomerName,
                totalPrice: order.TotalPrice,
                items: new List<OrderItem>(),
                created: order.Created,
                state: order.State.ToDal(),
                zip: order.Zip,
                street: order.Street,
                city: order.City,
                countryCode: order.CountryCode,
                email: order.Email,
                phone: order.Phone
                );

            entity.Items = order.Items.Select(i => i.ToDalOrNull(OrderItemConverter.ToDal)).ToList();

            return entity;
        };
    }
}
