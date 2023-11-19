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
 * @interface CreateChannelRequest
 */
export interface CreateChannelRequest {
  /**
   * 생성할 채널의 이름입니다.
   * @type {string}
   * @memberof CreateChannelRequest
   */
  name: string;
  /**
   * 생성할 채널의 1줄 설명입니다.
   * @type {string}
   * @memberof CreateChannelRequest
   */
  description: string;
  /**
   * Optional: 채널의 프로필 이미지 URL입니다.
   * @type {string}
   * @memberof CreateChannelRequest
   */
  imageUrl?: string | null;
}
