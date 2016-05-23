'use babel';

export default class HackerNewsSidePanelView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('news-view');
    this.element.setAttribute('id', 'news-view-id');
    let titleTag = document.createElement('h2');
    titleTag.textContent = "Top HN Stories at the moment";
    this.element.appendChild(titleTag);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
  // Create news-item HTML element.
  createNewsElement(story) {
    let tempDiv = document.createElement('div');
    tempDiv.classList.add('news-item');
    let anchor = document.createElement('a');
    anchor.setAttribute('href', story.url);
    anchor.text = story.title;
    tempDiv.appendChild(anchor);
    return tempDiv;
  }

  udpateStories(stories) {
      if(document.getElementById('news-view-items-id')) {
          document.getElementById('news-view-items-id').remove();
      }
      this.elementItems = document.createElement('div');
      this.elementItems.classList.add('news-view-items');
      this.elementItems.setAttribute('id', 'news-view-items-id');
      this.element.appendChild(this.elementItems);

      console.log("Updating stories: " + stories.length);
      for (var story of stories) {
        let newsItem = this.createNewsElement(story);
        this.elementItems.appendChild(newsItem);
      }
  }

}
