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
 * @interface ChannelUserInformationProjection
 */
export interface ChannelUserInformationProjection {
    /**
     * 
     * @type {string}
     * @memberof ChannelUserInformationProjection
     */
    'userId': string;
    /**
     * 
     * @type {string}
     * @memberof ChannelUserInformationProjection
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof ChannelUserInformationProjection
     */
    'email': string;
    /**
     * 
     * @type {ChannelPermissionType}
     * @memberof ChannelUserInformationProjection
     */
    'channelPermissionType': ChannelPermissionType;
    /**
     * 
     * @type {string}
     * @memberof ChannelUserInformationProjection
     */
    'profilePictureImageUrl'?: string | null;
}



