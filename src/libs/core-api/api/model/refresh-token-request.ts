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



/**
 * 
 * @export
 * @interface RefreshTokenRequest
 */
export interface RefreshTokenRequest {
    /**
     * 만료된 엑세스 토큰
     * @type {string}
     * @memberof RefreshTokenRequest
     */
    'accessToken': string;
    /**
     * 리프레시 토큰
     * @type {string}
     * @memberof RefreshTokenRequest
     */
    'refreshToken': string;
}

