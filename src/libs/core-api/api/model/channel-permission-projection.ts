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
import { ChannelPermissionType } from './channel-permission-type';

/**
 * 
 * @export
 * @interface ChannelPermissionProjection
 */
export interface ChannelPermissionProjection {
    /**
     * 
     * @type {string}
     * @memberof ChannelPermissionProjection
     */
    'userId': string;
    /**
     * 
     * @type {string}
     * @memberof ChannelPermissionProjection
     */
    'channelId': string;
    /**
     * 
     * @type {string}
     * @memberof ChannelPermissionProjection
     */
    'channelName': string;
    /**
     * 
     * @type {ChannelPermissionType}
     * @memberof ChannelPermissionProjection
     */
    'channelPermissionType': ChannelPermissionType;
    /**
     * 
     * @type {string}
     * @memberof ChannelPermissionProjection
     */
    'createdAt': string;
}



