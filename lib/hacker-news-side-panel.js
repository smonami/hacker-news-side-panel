'use babel';

import HackerNewsSidePanelView from './hacker-news-side-panel-view';
import { CompositeDisposable } from 'atom';
//Custom component.
import { NetworkService } from './network-service';

export default {

  hackerNewsSidePanelView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.hackerNewsSidePanelView = new HackerNewsSidePanelView(state.hackerNewsSidePanelViewState);
    this.modalPanel = atom.workspace.addRightPanel({
      item: this.hackerNewsSidePanelView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'hacker-news-side-panel:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.hackerNewsSidePanelView.destroy();
  },

  serialize() {
    return {
      hackerNewsSidePanelViewState: this.hackerNewsSidePanelView.serialize()
    };
  },

  updateView() {
    let networkService = new NetworkService("HN", "https://hacker-news.firebaseio.com/v0/topstories.json");
    networkService.getTopHN()
      .then(
        topHNIds => networkService.formatTopIds(topHNIds))
      .then(topNPosts => this.hackerNewsSidePanelView.udpateStories(topNPosts))
      .catch(error => console.error(error));
    this.modalPanel.show();
  },

  toggle() {
    console.log('HackerNewsSidePanel was toggled!');
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.updateView()
    );
  }

};
