#  Copyright 2025 Collate
#  Licensed under the Collate Community License, Version 1.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  https://github.com/open-metadata/OpenMetadata/blob/main/ingestion/LICENSE
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

"""
Validator for column values to be between test case
"""

from typing import Optional

from metadata.data_quality.validations.column.base.columnValuesToBeBetween import (
    BaseColumnValuesToBeBetweenValidator,
)
from metadata.data_quality.validations.mixins.pandas_validator_mixin import (
    PandasValidatorMixin,
)
from metadata.profiler.metrics.registry import Metrics
from metadata.utils.sqa_like_column import SQALikeColumn


class ColumnValuesToBeBetweenValidator(
    BaseColumnValuesToBeBetweenValidator, PandasValidatorMixin
):
    """Validator for column values to be between test case"""

    def _get_column_name(self) -> SQALikeColumn:
        """Get column name from the test case entity link

        Returns:
            SQALikeColumn: column
        """
        return self.get_column_name(
            self.test_case.entityLink.root,
            self.runner,
        )

    def _run_results(self, metric: Metrics, column: SQALikeColumn) -> Optional[int]:
        """compute result of the test case

        Args:
            metric: metric
            column: column
        """
        return self.run_dataframe_results(self.runner, metric, column)

    def compute_row_count(self, column: SQALikeColumn, min_bound: int, max_bound: int):
        """Compute row count for the given column

        Args:
            column (Union[SQALikeColumn, Column]): column to compute row count for
            min_bound (_type_): min bound to filter out rows within the bound
            max_bound (_type_): max bound to filter out rows within the bound

        Raises:
            NotImplementedError:
        """
        row_count = self._compute_row_count(self.runner, column)
        failed_rows = sum(
            len(
                runner.query(
                    f"`{column.name}` > {max_bound} or `{column.name}` < {min_bound}"
                )
            )
            for runner in self.runner  # type: ignore
        )

        return row_count, failed_rows
