﻿using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;
using System;

using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        public BasketRepository(IConnectionMultiplexer redis)
        {
          
                _database = redis.GetDatabase();            
          
        }

        public Task<bool> DeleteBasketAsync(string basketId)
        {
            return _database.KeyDeleteAsync(basketId);
        }

        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            var data = await _database.StringGetAsync(basketId);
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var created = await _database.StringSetAsync(basket.Id,
                JsonSerializer.Serialize(basket),
                TimeSpan.FromDays(30)
                );
            if (!created)
            {
                return null;
            }
            return await GetBasketAsync(basket.Id);
        }
    }
}
