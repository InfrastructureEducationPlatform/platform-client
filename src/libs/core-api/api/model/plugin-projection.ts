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
import { PluginInstallationProjection } from './plugin-installation-projection';
// May contain unused imports in some cases
// @ts-ignore
import { PluginTypeDefinition } from './plugin-type-definition';

/**
 *
 * @export
 * @interface PluginProjection
 */
export interface PluginProjection {
  /**
   *
   * @type {string}
   * @memberof PluginProjection
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof PluginProjection
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof PluginProjection
   */
  description: string;
  /**
   *
   * @type {Array<PluginTypeDefinition>}
   * @memberof PluginProjection
   */
  pluginTypeDefinitions: Array<PluginTypeDefinition>;
  /**
   *
   * @type {PluginInstallationProjection}
   * @memberof PluginProjection
   */
  pluginInstallation?: PluginInstallationProjection;
}