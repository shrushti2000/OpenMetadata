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


 /**
 * SAS Connection Config
 */
export interface SASConnection {
    /**
     * Enable dataflow for ingestion
     */
    dataflows?: boolean;
    /**
     * Custom filter for dataflows
     */
    dataflowsCustomFilter?: { [key: string]: any } | string;
    /**
     * Enable datatables for ingestion
     */
    datatables?: boolean;
    /**
     * Custom filter for datatables
     */
    dataTablesCustomFilter?: { [key: string]: any } | string;
    /**
     * Password to connect to SAS Viya
     */
    password: string;
    /**
     * Enable report for ingestion
     */
    reports?: boolean;
    /**
     * Custom filter for reports
     */
    reportsCustomFilter?: { [key: string]: any } | string;
    /**
     * Hostname of SAS Viya deployment.
     */
    serverHost: string;
    /**
     * Service Type
     */
    type?: SASType;
    /**
     * Username to connect to SAS Viya.
     */
    username: string;
}

/**
 * Service Type
 *
 * Service type.
 */
export enum SASType {
    SAS = "SAS",
}