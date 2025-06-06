/*
 *  Copyright 2025 Collate.
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

import { WorkflowInstance } from '../../generated/governance/workflows/workflowInstance';
import { WorkflowInstanceState } from '../../generated/governance/workflows/workflowInstanceState';
import { ServicesType } from '../../interface/service.interface';

export interface ServiceInsightsTabProps {
  serviceDetails: ServicesType;
  workflowStatesData?: WorkflowStatesData;
  isWorkflowStatusLoading: boolean;
}
export interface WorkflowStatesData {
  mainInstanceState: WorkflowInstance;
  subInstanceStates: WorkflowInstanceState[];
}
export interface ServiceInsightWidgetCommonProps {
  serviceName: string;
  workflowStatesData?: WorkflowStatesData;
}
