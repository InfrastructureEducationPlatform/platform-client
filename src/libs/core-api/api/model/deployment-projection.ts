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
import { DeploymentStatus } from './deployment-status';

/**
 *
 * @export
 * @interface DeploymentProjection
 */
export interface DeploymentProjection {
  /**
   *
   * @type {string}
   * @memberof DeploymentProjection
   */
  deploymentId: string;
  /**
   *
   * @type {string}
   * @memberof DeploymentProjection
   */
  sketchId: string;
  /**
   *
   * @type {string}
   * @memberof DeploymentProjection
   */
  pluginId: string;
  /**
   *
   * @type {DeploymentStatus}
   * @memberof DeploymentProjection
   */
  deploymentStatus: DeploymentStatus;
  /**
   *
   * @type {string}
   * @memberof DeploymentProjection
   */
  createdAt: string;
  /**
   *
   * @type {any}
   * @memberof DeploymentProjection
   */
  deploymentOutput?: any | null;
}
