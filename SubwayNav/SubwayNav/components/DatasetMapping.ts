import { ItemColumns } from '../ManifestConstants';
import { ISubNavItem, ICustomSubwayNavProps } from './components.types';
import { SubwayNavNodeState, ISubwayNavNodeProps } from '../utilities/subway-nav/subway-node.types';

export function getItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): ISubNavItem[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return [getDummyAction('1'), getDummyAction('2'), getDummyAction('3'), getDummyAction('4')];
    }
    const keyIndex: Record<string, number> = {};
    return dataset.sortedRecordIds.map((id) => {
        const record = dataset.records[id];
        // Prevent duplicate keys by appending the duplicate index
        let key = record.getValue(ItemColumns.Key) as string;
        if (keyIndex[key] !== undefined) {
            keyIndex[key]++;
            key += `_${keyIndex[key]}`;
        } else keyIndex[key] = 1;
        return {
            id: record.getRecordId(),
            key: record.getValue(ItemColumns.Key),
            label: record.getFormattedValue(ItemColumns.Label),
            state: record.getValue(ItemColumns.State),
            disabled: record.getValue(ItemColumns.Disabled),
            parentId: record.getValue(ItemColumns.ParentKey),
            visuallyDisabled: record.getValue(ItemColumns.VisuallyDisabled),
            data: record,
        } as ISubNavItem;
    });
}

export function getDatasetfromItems(steps: ISubwayNavNodeProps[]): ICustomSubwayNavProps[] {
    let stepDataSet: ICustomSubwayNavProps[] = [];
    const parentstepDateSet = steps.map((step: ISubwayNavNodeProps) => {
        if (Array.isArray(step.subSteps) && step.subSteps.length) {
            stepDataSet = stepDataSet.concat(
                step.subSteps.map((subStep) => {
                    return {
                        ItemKey: subStep.id,
                        ItemLabel: subStep.label,
                        ItemState: subStep.state,
                        ItemDisabled: subStep.disabled,
                        ParentItemKey: subStep.parentId,
                        ItemVisuallyDisabled: subStep.isVisuallyDisabled,
                    } as ICustomSubwayNavProps;
                }),
            );
        }
        return {
            ItemKey: step.id,
            ItemLabel: step.label,
            ItemState: step.state,
            ItemDisabled: step.disabled,
            ParentItemKey: step.parentId,
            ItemVisuallyDisabled: step.isVisuallyDisabled,
        } as ICustomSubwayNavProps;
    });
    return [...parentstepDateSet, ...stepDataSet];
}

function getDummyAction(id: string): ISubNavItem {
    return {
        id: id,
        label: 'Node ' + id,
        key: id,
        parentId: id === '5' ? '2' : undefined,
        state: id === '1' ? 'Current' : 'Not Started',
    } as ISubNavItem;
}

export function getSubwayNavNodeState(state: string): SubwayNavNodeState {
    switch (state) {
        case 'NotStarted':
            return SubwayNavNodeState.NotStarted;
        case 'Current':
            return SubwayNavNodeState.Current;
        case 'Completed':
            return SubwayNavNodeState.Completed;
        case 'ViewedNotCompleted':
            return SubwayNavNodeState.ViewedNotCompleted;
        case 'Unsaved':
            return SubwayNavNodeState.Unsaved;
        case 'Skipped':
            return SubwayNavNodeState.Skipped;
        case 'Error':
            return SubwayNavNodeState.Error;
        case 'CurrentWithSubSteps':
            return SubwayNavNodeState.CurrentWithSubSteps;
        case 'WizardComplete':
            return SubwayNavNodeState.WizardComplete;
        default:
            return SubwayNavNodeState.NotStarted;
    }
}
