import { CacheManager } from "../managers/CacheManager";
import { ProductAccess } from "../types";

export class DomainService {
 static async shouldRunOnThisDomain(): Promise<boolean> {
  try {
   const response = await CacheManager.get();

   if (!response.success || !response.userData?.productAccess) {
    return false;
   }

   const currentDomain = window.location.hostname;
   return this.hasAccessToDomain(
    response.userData.productAccess,
    currentDomain
   );
  } catch (error) {
   return false;
  }
 }

 static hasAccessToDomain(
  productAccess: ProductAccess[],
  domain: string
 ): boolean {
  return productAccess.some((access) => {
   try {
    const accessDomain = new URL(access.website).hostname;
    return accessDomain === domain;
   } catch {
    return false;
   }
  });
 }

 static findMatchingAccess(
  productAccess: ProductAccess[],
  domain: string
 ): ProductAccess | undefined {
  return productAccess.find((access) => {
   try {
    const accessDomain = new URL(access.website).hostname;
    return accessDomain === domain;
   } catch {
    return false;
   }
  });
 }

 static isAccessExpired(access: ProductAccess): boolean {
  return new Date(access.endDate) <= new Date();
 }
}
