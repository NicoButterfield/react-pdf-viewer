/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useState } from 'react';

import Button from '../components/Button';
import { Toggle } from '../hooks/useToggle';
import HandToolIcon from '../icons/HandToolIcon';
import InfoIcon from '../icons/InfoIcon';
import LeftSidebarIcon from '../icons/LeftSidebarIcon';
import TextSelectionIcon from '../icons/TextSelectionIcon';
import { RenderToolbarSlot } from './ToolbarSlot';
import LocalizationContext from '../localization/LocalizationContext';
import LocalizationMap from '../localization/LocalizationMap';
import Modal from '../portal/Modal';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import PropertiesModal from '../property/PropertiesModal';
import Match from '../search/Match';
import SearchPopover from '../search/SearchPopover';
import ScrollMode from '../ScrollMode';
import SelectionMode from '../SelectionMode';
import PdfJs from '../vendors/PdfJs';
import MoreActionsPopover from './MoreActionsPopover';

interface ToolbarProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    renderToolbar: RenderToolbarSlot;
    scrollMode: ScrollMode;
    selectionMode: SelectionMode;
    onChangeSelectionMode(mode: SelectionMode): void;
    onJumpToMatch(match: Match): void;
    onSearchFor(keyword: RegExp): void;
    onToggleSidebar(): void;
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const Toolbar: React.FC<ToolbarProps> = ({
    doc, fileName, scrollMode, selectionMode,
    onChangeSelectionMode,
    onJumpToMatch, onSearchFor, onToggleSidebar,
    renderToolbar,
}) => {
    const l10n = useContext(LocalizationContext);
    const [isSidebarOpened, setSidebarOpened] = useState(false);

    const toggleSidebar = (): void => {
        setSidebarOpened(!isSidebarOpened);
        onToggleSidebar();
    };

    const activateTextSelectionMode = (): void => onChangeSelectionMode(SelectionMode.Text);
    const activateHandMode = (): void => onChangeSelectionMode(SelectionMode.Hand);

    const renderToggle = (): LocalizationMap => l10n.toolbar.toggleSidebar;
    const renderTextSelection = (): LocalizationMap => l10n.toolbar.textSelectionTool;
    const renderHandTool = (): LocalizationMap => l10n.toolbar.handTool;
    const renderDocumentProperties = (): LocalizationMap => l10n.toolbar.documentProperties;
    const renderPropertyButton = (toggle: Toggle): React.ReactElement => (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={toggle}><InfoIcon /></Button>}
            content={renderDocumentProperties}
            offset={TOOLTIP_OFFSET}
        />
    );
    const renderPropertiesModal = (toggle: Toggle): React.ReactElement => (
        <PropertiesModal doc={doc} fileName={fileName} onToggle={toggle} />
    );

    return renderToolbar({
        documentPropertiesButton: (
            <Modal
                target={renderPropertyButton}
                content={renderPropertiesModal}
                closeOnClickOutside={true}
                closeOnEscape={true}
            />
        ),
        handToolButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <Button onClick={activateHandMode} isSelected={selectionMode === SelectionMode.Hand}><HandToolIcon /></Button>
                }
                content={renderHandTool}
                offset={TOOLTIP_OFFSET}
            />
        ),
        moreActionsPopover: (
            <MoreActionsPopover
                doc={doc}
                fileName={fileName}
                scrollMode={scrollMode}
                selectionMode={selectionMode}
                onChangeSelectionMode={onChangeSelectionMode}
            />
        ),
        searchPopover: (
            <SearchPopover doc={doc} onJumpToMatch={onJumpToMatch} onSearchFor={onSearchFor} />
        ),
        textSelectionButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <Button onClick={activateTextSelectionMode} isSelected={selectionMode === SelectionMode.Text}><TextSelectionIcon /></Button>
                }
                content={renderTextSelection}
                offset={TOOLTIP_OFFSET}
            />
        ),
        toggleSidebarButton: (
            <Tooltip
                position={Position.BottomLeft}
                target={(
                    <Button onClick={toggleSidebar} isSelected={isSidebarOpened}>
                        <LeftSidebarIcon />
                    </Button>
                )}
                content={renderToggle}
                offset={TOOLTIP_OFFSET}
            />
        ),
    });
};

export default Toolbar;
