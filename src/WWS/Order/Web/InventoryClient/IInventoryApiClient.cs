using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.InventoryClient.DTOs;

namespace Web.InventoryClient
{
    public interface IInventoryApiClient
    {
        [Get("/api/inventory/items/{id}")]
        Task<InventoryItemResponse> GetInventoryItem([AliasAs("id")] long itemId);
    }
}
