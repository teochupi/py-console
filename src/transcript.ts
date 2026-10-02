type EntryKind = 'stdout' | 'stderr' | 'input' | 'system';

/** Render Python text safely, with a bounded, chronological transcript. */
export class Transcript {
  private length = 0;
  constructor(private readonly container: HTMLElement) {}

  clear() {
    this.container.replaceChildren();
    this.length = 0;
  }

  append(text: string, kind: EntryKind = 'stdout') {
    const entry = document.createElement('span');
    entry.className = `console-entry console-${kind}`;
    if (kind === 'input') {
      entry.setAttribute('aria-label', 'Въведени данни');
      const marker = document.createElement('span');
      marker.className = 'console-marker';
      marker.setAttribute('aria-hidden', 'true');
      marker.textContent = '>>> ';
      entry.append(marker);
    }
    const content = document.createElement('span');
    content.className = 'console-text';
    // Input occupies its own line; avoid an extra empty line inside it.
    content.textContent = kind === 'input' ? text.replace(/\n$/, '') : text;
    entry.append(content);
    this.container.append(entry);
    this.length += content.textContent.length;
    // Limit characters and nodes, including repeated empty input responses.
    while (this.length > 200000 || this.container.childElementCount > 4000) {
      const first = this.container.firstElementChild!;
      this.length -= first.querySelector('.console-text')?.textContent?.length ?? 0;
      first.remove();
    }
    this.container.scrollTop = this.container.scrollHeight;
  }
}

