(function () {
  function scrollToBottom(): void {
    const anchor = document.getElementById('bottom-anchor');
    if (anchor && 'scrollIntoView' in anchor) {
      anchor.scrollIntoView({ block: 'end' });
    }
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    window.scrollTo(0, h);
  }

  function focusComposer(): void {
    const ta = document.getElementById('content') as HTMLTextAreaElement | null;
    if (ta && typeof ta.focus === 'function') {
      ta.focus();
    }
  }

  function setupKeyboardAvoidance(): void {
    const composer = document.getElementById('composer') as HTMLElement | null;
    const ta = document.getElementById('content') as HTMLTextAreaElement | null;
    if (!composer) return;

    const vv: any = (window as any).visualViewport;
    if (vv && typeof vv.addEventListener === 'function') {
      const adjust = () => {
        const keyboard = Math.max(0, (window.innerHeight - vv.height - (vv.offsetTop || 0)));
        composer.style.transform = keyboard > 0 ? `translateY(-${keyboard}px)` : '';
      };
      vv.addEventListener('resize', adjust);
      vv.addEventListener('scroll', adjust);
      adjust();
    } else if (ta) {
      ta.addEventListener('focus', () => setTimeout(scrollToBottom, 100));
    }
  }

  function setupEnterToSend(): void {
    const ta = document.getElementById('content') as HTMLTextAreaElement | null;
    if (!ta) return;
    ta.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const form = ta.closest('form') as HTMLFormElement | null;
        if (form) form.submit();
      }
    });
  }

  function deferScroll(): void {
    setTimeout(scrollToBottom, 0);
    setTimeout(scrollToBottom, 100);
    setTimeout(scrollToBottom, 300);
    setTimeout(() => { scrollToBottom(); focusComposer(); }, 500);
  }

  window.addEventListener('DOMContentLoaded', deferScroll);
  window.addEventListener('load', deferScroll);
  window.addEventListener('DOMContentLoaded', setupKeyboardAvoidance);
  window.addEventListener('load', setupKeyboardAvoidance);
  window.addEventListener('DOMContentLoaded', setupEnterToSend);
  window.addEventListener('load', setupEnterToSend);
})();
