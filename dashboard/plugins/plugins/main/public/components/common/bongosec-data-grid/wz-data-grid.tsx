import React, { useState, useMemo, useEffect } from 'react';
import {
  EuiFlexItem,
  EuiToolTip,
  EuiButtonIcon,
  EuiDataGridCellValueElementProps,
  EuiDataGrid,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiFlexGroup,
} from '@elastic/eui';
import {
  useDataGrid,
  exportSearchToCSV,
  tDataGridColumn,
  getAllCustomRenders,
  PaginationOptions,
} from '../data-grid';
import { getBongosecCorePlugin } from '../../../kibana-services';
import {
  Filter,
  IndexPattern,
  SearchResponse,
} from '../../../../../../src/plugins/data/public';
import {
  ErrorHandler,
  ErrorFactory,
  HttpError,
} from '../../../react-services/error-management';
import { LoadingSearchbarProgress } from '../loading-searchbar-progress/loading-searchbar-progress';
import { DiscoverNoResults } from '../no-results/no-results';
import { DocumentViewTableAndJson } from '../bongosec-discover/components/document-view-table-and-json';
import DiscoverDataGridAdditionalControls from '../bongosec-discover/components/data-grid-additional-controls';
import './bongosec-data-grid.scss';
import { wzDiscoverRenderColumns } from '../bongosec-discover/render-columns';
import DocDetailsHeader from '../bongosec-discover/components/doc-details-header';

export const MAX_ENTRIES_PER_QUERY = 10000;

export type tBongosecDataGridProps = {
  indexPattern: IndexPattern;
  results: SearchResponse;
  defaultColumns: tDataGridColumn[];
  isLoading: boolean;
  defaultPagination: PaginationOptions;
  query: any;
  exportFilters: tFilter[];
  dateRange: TimeRange;
  onChangePagination: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  onChangeSorting: (sorting: { columns: any[]; onSort: any }) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
};

const BongosecDataGrid = (props: tBongosecDataGridProps) => {
  const {
    results,
    defaultColumns,
    indexPattern,
    isLoading,
    defaultPagination,
    onChangePagination,
    exportFilters = [],
    onChangeSorting,
    query,
    dateRange,
    filters,
    setFilters,
  } = props;
  const [inspectedHit, setInspectedHit] = useState<any>(undefined);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const sideNavDocked = getBongosecCorePlugin().hooks.useDockedSideNav();

  const onClickInspectDoc = useMemo(
    () => (index: number) => {
      const rowClicked = results.hits.hits[index];
      setInspectedHit(rowClicked);
    },
    [results],
  );

  const DocViewInspectButton = ({
    rowIndex,
  }: EuiDataGridCellValueElementProps) => {
    const inspectHintMsg = 'Inspect document details';
    return (
      <EuiToolTip content={inspectHintMsg}>
        <EuiButtonIcon
          onClick={() => onClickInspectDoc(rowIndex)}
          iconType='inspect'
          aria-label={inspectHintMsg}
        />
      </EuiToolTip>
    );
  };

  const dataGridProps = useDataGrid({
    ariaLabelledBy: 'Actions data grid',
    defaultColumns,
    renderColumns: wzDiscoverRenderColumns,
    results,
    indexPattern: indexPattern as IndexPattern,
    DocViewInspectButton,
    useDefaultPagination: true,
  });

  const { pagination, sorting, columnVisibility } = dataGridProps;

  useEffect(() => {
    onChangePagination && onChangePagination(pagination);
  }, [JSON.stringify(pagination)]);

  useEffect(() => {
    onChangeSorting && onChangeSorting(sorting || []);
  }, [JSON.stringify(sorting)]);

  const timeField = indexPattern?.timeFieldName
    ? indexPattern.timeFieldName
    : undefined;

  const onClickExportResults = async () => {
    const params = {
      indexPattern: indexPattern as IndexPattern,
      filters: exportFilters,
      query,
      fields: columnVisibility.visibleColumns,
      pagination: {
        pageIndex: 0,
        pageSize: results.hits.total,
      },
      sorting,
    };
    try {
      setIsExporting(true);
      await exportSearchToCSV(params);
    } catch (error) {
      const searchError = ErrorFactory.create(HttpError, {
        error,
        message: 'Error downloading csv report',
      });
      ErrorHandler.handleError(searchError);
    } finally {
      setIsExporting(false);
    }
  };

  const closeFlyoutHandler = () => setInspectedHit(undefined);

  return (
    <>
      {isLoading ? <LoadingSearchbarProgress /> : null}
      {!isLoading && !results?.hits?.total === 0 ? (
        <DiscoverNoResults timeFieldName={timeField} queryLanguage={''} />
      ) : null}
      {!isLoading && results?.hits?.total > 0 ? (
        <div className='bongosecDataGridContainer'>
          <EuiDataGrid
            /* TODO: this component is not used in the current plugins so this could be removed.
              If this is used in future versions, we should add the functionality to manage the
              visibility of columns thorugh the Available fields button.
            */
            {...dataGridProps}
            className={sideNavDocked ? 'dataGridDockedNav' : ''}
            toolbarVisibility={{
              additionalControls: (
                <>
                  <DiscoverDataGridAdditionalControls
                    totalHits={results.hits.total}
                    isExporting={isExporting}
                    onClickExportResults={onClickExportResults}
                    maxEntriesPerQuery={MAX_ENTRIES_PER_QUERY}
                    dateRange={dateRange}
                  />
                </>
              ),
            }}
          />
        </div>
      ) : null}
      {inspectedHit && (
        <EuiFlyout onClose={closeFlyoutHandler} size='m'>
          <EuiFlyoutHeader>
            <EuiTitle>
              <DocDetailsHeader
                doc={inspectedHit}
                indexPattern={indexPattern}
              />
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiFlexGroup direction='column'>
              <EuiFlexItem>
                <DocumentViewTableAndJson
                  document={inspectedHit}
                  indexPattern={indexPattern as IndexPattern}
                  renderFields={getAllCustomRenders(
                    defaultTableColumns,
                    wzDiscoverRenderColumns,
                  )}
                  filters={filters}
                  setFilters={setFilters}
                  onFilter={closeFlyoutHandler}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutBody>
        </EuiFlyout>
      )}
    </>
  );
};

export default BongosecDataGrid;
