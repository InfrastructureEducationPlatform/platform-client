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
import { VendorType } from './vendor-type';

/**
 *
 * @export
 * @interface PriceInfoPerVendorProjection
 */
export interface PriceInfoPerVendorProjection {
  /**
   *
   * @type {string}
   * @memberof PriceInfoPerVendorProjection
   */
  pricingInformationId: string;
  /**
   *
   * @type {VendorType}
   * @memberof PriceInfoPerVendorProjection
   */
  vendor: VendorType;
  /**
   *
   * @type {number}
   * @memberof PriceInfoPerVendorProjection
   */
  pricePerHour: number;
  /**
   *
   * @type {string}
   * @memberof PriceInfoPerVendorProjection
   */
  tierInformation: string;
}
