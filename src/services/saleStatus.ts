"use server"

import prisma from "../lib/prisma";
import { saleStats } from "../utils/saleStats";

export const getOverallSaleStatus = async() => {
  const items = await prisma.orderItem.findMany({
    select: {
      quantity: true,
      price: true,
      order: {
        select: {
          status: true,
        }
      }
    }
  })

  return saleStats(items);
};

export const getSellerSaleStatus = async(userId:string) => {
  const items = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId: userId
      }
    },
    select: {
      quantity: true,
      price: true,
      order: {
        select: {
          status: true,
        }
      }
    }
  });

  return saleStats(items);
};