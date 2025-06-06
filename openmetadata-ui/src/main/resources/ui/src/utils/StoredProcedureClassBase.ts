/*
 *  Copyright 2024 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { TabProps } from '../components/common/TabsLabel/TabsLabel.interface';
import {
  CUSTOM_PROPERTIES_WIDGET,
  DATA_PRODUCTS_WIDGET,
  DESCRIPTION_WIDGET,
  GLOSSARY_TERMS_WIDGET,
  GridSizes,
  TAGS_WIDGET,
} from '../constants/CustomizeWidgets.constants';
import { STORED_PROCEDURE_DUMMY_DATA } from '../constants/Table.constants';
import { DetailPageWidgetKeys } from '../enums/CustomizeDetailPage.enum';
import { EntityTabs } from '../enums/entity.enum';
import { StoredProcedure } from '../generated/entity/data/storedProcedure';
import { EntityReference } from '../generated/entity/type';
import { Tab } from '../generated/system/ui/uiCustomization';
import { FeedCounts } from '../interface/feed.interface';
import { WidgetConfig } from '../pages/CustomizablePage/CustomizablePage.interface';
import { getTabLabelFromId } from './CustomizePage/CustomizePageUtils';
import i18n from './i18next/LocalUtil';
import {
  getStoredProcedureDetailsPageTabs,
  getStoredProcedureWidgetsFromKey,
} from './StoredProceduresUtils';

export interface StoredProcedureDetailPageTabProps {
  activeTab: EntityTabs;
  feedCount: FeedCounts;
  decodedStoredProcedureFQN: string;
  entityName: string;
  code: string;
  deleted: boolean;
  owners: EntityReference[];
  storedProcedure: StoredProcedure;
  editLineagePermission: boolean;
  editCustomAttributePermission: boolean;
  viewAllPermission: boolean;
  labelMap?: Record<EntityTabs, string>;
  onExtensionUpdate: (value: StoredProcedure) => Promise<void>;
  getEntityFeedCount: () => void;
  fetchStoredProcedureDetails: () => Promise<void>;
  handleFeedCount: (data: FeedCounts) => void;
}

type StoredProcedureWidgetKeys =
  | DetailPageWidgetKeys.DESCRIPTION
  | DetailPageWidgetKeys.STORED_PROCEDURE_CODE
  | DetailPageWidgetKeys.DATA_PRODUCTS
  | DetailPageWidgetKeys.TAGS
  | DetailPageWidgetKeys.GLOSSARY_TERMS
  | DetailPageWidgetKeys.CUSTOM_PROPERTIES;

class StoredProcedureClassBase {
  defaultWidgetHeight: Record<StoredProcedureWidgetKeys, number>;

  constructor() {
    this.defaultWidgetHeight = {
      [DetailPageWidgetKeys.DESCRIPTION]: 2,
      [DetailPageWidgetKeys.STORED_PROCEDURE_CODE]: 6,
      [DetailPageWidgetKeys.DATA_PRODUCTS]: 2,
      [DetailPageWidgetKeys.TAGS]: 2,
      [DetailPageWidgetKeys.GLOSSARY_TERMS]: 2,
      [DetailPageWidgetKeys.CUSTOM_PROPERTIES]: 4,
    };
  }

  public getStoredProcedureDetailPageTabs(
    tabsProps: StoredProcedureDetailPageTabProps
  ): TabProps[] {
    return getStoredProcedureDetailsPageTabs(tabsProps);
  }

  public getStoredProcedureDetailPageTabsIds(): Tab[] {
    return [
      EntityTabs.CODE,
      EntityTabs.ACTIVITY_FEED,
      EntityTabs.LINEAGE,
      EntityTabs.CUSTOM_PROPERTIES,
    ].map((tab: EntityTabs) => ({
      id: tab,
      name: tab,
      displayName: getTabLabelFromId(tab),
      layout: this.getDefaultLayout(tab),
      editable: [EntityTabs.CODE].includes(tab),
    }));
  }

  public getDefaultLayout(tab?: EntityTabs): WidgetConfig[] {
    if (tab && tab !== EntityTabs.CODE) {
      return [];
    }

    return [
      {
        h:
          this.defaultWidgetHeight[DetailPageWidgetKeys.DESCRIPTION] +
          this.defaultWidgetHeight[DetailPageWidgetKeys.STORED_PROCEDURE_CODE] +
          0.5,
        i: DetailPageWidgetKeys.LEFT_PANEL,
        w: 6,
        x: 0,
        y: 0,
        children: [
          {
            h: this.defaultWidgetHeight[DetailPageWidgetKeys.DESCRIPTION],
            i: DetailPageWidgetKeys.DESCRIPTION,
            w: 1,
            x: 0,
            y: 0,
            static: false,
          },
          {
            h: this.defaultWidgetHeight[
              DetailPageWidgetKeys.STORED_PROCEDURE_CODE
            ],
            i: DetailPageWidgetKeys.STORED_PROCEDURE_CODE,
            w: 1,
            x: 0,
            y: 1,
            static: false,
          },
        ],
        static: true,
      },
      {
        h: this.defaultWidgetHeight[DetailPageWidgetKeys.DATA_PRODUCTS],
        i: DetailPageWidgetKeys.DATA_PRODUCTS,
        w: 2,
        x: 6,
        y: 1,
        static: false,
      },
      {
        h: this.defaultWidgetHeight[DetailPageWidgetKeys.TAGS],
        i: DetailPageWidgetKeys.TAGS,
        w: 2,
        x: 6,
        y: 2,
        static: false,
      },
      {
        h: this.defaultWidgetHeight[DetailPageWidgetKeys.GLOSSARY_TERMS],
        i: DetailPageWidgetKeys.GLOSSARY_TERMS,
        w: 2,
        x: 6,
        y: 3,
        static: false,
      },
      {
        h: this.defaultWidgetHeight[DetailPageWidgetKeys.CUSTOM_PROPERTIES],
        i: DetailPageWidgetKeys.CUSTOM_PROPERTIES,
        w: 2,
        x: 6,
        y: 6,
        static: false,
      },
    ];
  }

  public getAlertEnableStatus() {
    return false;
  }

  public getDummyData(): StoredProcedure {
    return STORED_PROCEDURE_DUMMY_DATA;
  }

  public getCommonWidgetList() {
    return [
      DESCRIPTION_WIDGET,
      {
        fullyQualifiedName: DetailPageWidgetKeys.STORED_PROCEDURE_CODE,
        name: i18n.t('label.code'),
        data: {
          gridSizes: ['large'] as GridSizes[],
        },
      },
      DATA_PRODUCTS_WIDGET,
      TAGS_WIDGET,
      GLOSSARY_TERMS_WIDGET,
      CUSTOM_PROPERTIES_WIDGET,
    ];
  }

  public getWidgetsFromKey(widgetConfig: WidgetConfig) {
    return getStoredProcedureWidgetsFromKey(widgetConfig);
  }

  public getWidgetHeight(widgetName: string) {
    switch (widgetName) {
      case DetailPageWidgetKeys.DESCRIPTION:
        return this.defaultWidgetHeight[DetailPageWidgetKeys.DESCRIPTION];
      case DetailPageWidgetKeys.TABLE_SCHEMA:
        return this.defaultWidgetHeight[
          DetailPageWidgetKeys.STORED_PROCEDURE_CODE
        ];
      case DetailPageWidgetKeys.FREQUENTLY_JOINED_TABLES:
        return this.defaultWidgetHeight[DetailPageWidgetKeys.DATA_PRODUCTS];
      case DetailPageWidgetKeys.DATA_PRODUCTS:
        return this.defaultWidgetHeight[DetailPageWidgetKeys.TAGS];
      case DetailPageWidgetKeys.TAGS:
        return this.defaultWidgetHeight[DetailPageWidgetKeys.TAGS];
      case DetailPageWidgetKeys.GLOSSARY_TERMS:
        return this.defaultWidgetHeight[DetailPageWidgetKeys.GLOSSARY_TERMS];
      case DetailPageWidgetKeys.TABLE_CONSTRAINTS:
        return this.defaultWidgetHeight[DetailPageWidgetKeys.CUSTOM_PROPERTIES];
      default:
        return 1;
    }
  }
}

const storedProcedureClassBase = new StoredProcedureClassBase();

export default storedProcedureClassBase;
export { StoredProcedureClassBase };
