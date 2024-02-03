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
import { ChannelPermissionProjection } from './channel-permission-projection';

/**
 *
 * @export
 * @interface MeProjection
 */
export interface MeProjection {
  /**
   *
   * @type {string}
   * @memberof MeProjection
   */
  userId: string;
  /**
   *
   * @type {string}
   * @memberof MeProjection
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof MeProjection
   */
  email: string;
  /**
   *
   * @type {string}
   * @memberof MeProjection
   */
  profilePictureImageUrl?: string | null;
  /**
   *
   * @type {Array<ChannelPermissionProjection>}
   * @memberof MeProjection
   */
  channelPermissionList: Array<ChannelPermissionProjection>;
}