/* tslint:disable */

/* eslint-disable */

/**
 * BlockInfrastructure-Core
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
// May contain unused imports in some cases
// @ts-ignore
import { PriceInfoPerVendorProjection } from './price-info-per-vendor-projection';
// May contain unused imports in some cases
// @ts-ignore
import { PricingMachineType } from './pricing-machine-type';

/**
 *
 * @export
 * @interface PricingInformationProjection
 */
export interface PricingInformationProjection {
  /**
   *
   * @type {string}
   * @memberof PricingInformationProjection
   */
  id: string;
  /**
   *
   * @type {PricingMachineType}
   * @memberof PricingInformationProjection
   */
  machineType: PricingMachineType;
  /**
   *
   * @type {string}
   * @memberof PricingInformationProjection
   */
  tier: string;
  /**
   *
   * @type {Array<PriceInfoPerVendorProjection>}
   * @memberof PricingInformationProjection
   */
  priceInfoPerVendors: Array<PriceInfoPerVendorProjection>;
}