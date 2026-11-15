/* PIXTION · main.js — entry point. Imports every module and starts them in order. */
import { app } from './shared.js';
import { init as initCoreCodec } from './core/codec.js';
import { init as initCoreDownloads } from './core/downloads.js';
import { init as initCoreEnv } from './core/env.js';
import { init as initCoreRender } from './core/render.js';
import { init as initCoreStorage } from './core/storage.js';
import { init as initState } from './state.js';
import { init as initStudioBoard } from './studio/board.js';
import { init as initStudioFramesUi } from './studio/frames-ui.js';
import { init as initStudioHistory, updUndo } from './studio/history.js';
import { init as initStudioImport } from './studio/import.js';
import { init as initStudioPaletteUi } from './studio/palette-ui.js';
import { init as initStudioPlayback } from './studio/playback.js';
import { init as initStudioSave } from './studio/save.js';
import { init as initStudioShortcuts } from './studio/shortcuts.js';
import { init as initStudioTools } from './studio/tools.js';
import { init as initStudioView } from './studio/view.js';
import { init as initTemplatesCatalog } from './templates/catalog.js';
import { init as initTemplatesMaps } from './templates/maps.js';
import { init as initViewsExportSheet } from './views/export-sheet.js';
import { init as initViewsGallery } from './views/gallery.js';
import { init as initViewsNav, go } from './views/nav.js';
import { init as initViewsPlayer } from './views/player.js';
import { init as initViewsProfile } from './views/profile.js';
import { init as initViewsSettings } from './views/settings.js';

// Start-up: each module wires its own buttons and loads its data, in this order.
initCoreCodec();
initCoreEnv();
initCoreStorage();
initCoreDownloads();
initCoreRender();
initTemplatesMaps();
initTemplatesCatalog();
initState();
initViewsNav();
initViewsProfile();
initViewsSettings();
initStudioBoard();
initStudioView();
initStudioHistory();
initStudioShortcuts();
initStudioTools();
initStudioPaletteUi();
initStudioFramesUi();
initStudioImport();
initStudioPlayback();
initStudioSave();
initViewsGallery();
initViewsPlayer();
initViewsExportSheet();

// First screen
updUndo();
go(app.profile ? 'home' : 'welcome');
