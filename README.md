# 实现前端页面添加水印

- 导出水印 SVG
  - figma 创建一个 frame
  - 在 frame 中创建一个 text
  - 居中 text 并旋转一定角度
  - 选中 frame 导出为 SVG
- 设置 CSS 样式

  ```html
  <div className="watermarked">
    <!-- ... -->
  </div>
  ```

  ```css
  .watermarked::before {
    content: "";

    display: block;
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    background-image: url("./asset/watermark.svg");
    background-repeat: repeat;
    background-position: center;

    opacity: 0.3;

    pointer-events: none;
  }
  ```

- 进阶：使用 MutationObserver 防止直接屏蔽水印

  ```tsx
  function makeWatermark() {
    const div = document.createElement("div");

    div.style.width = "100%";
    div.style.height = "100%";
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.backgroundImage = 'url("/watermark.svg")';
    div.style.backgroundRepeat = "repeat";
    div.style.backgroundPosition = "center";
    div.style.opacity = "0.3";
    div.style.pointerEvents = "none";

    return div;
  }

  function observe(element: any, callback: any) {
    const observer = new MutationObserver((mutations) => {
      const mutation = mutations.at(0);
      if (mutation) callback();
    });

    observer.observe(element, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
    });

    return () => observer.disconnect();
  }

  function Watermark(props: any) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const container = ref.current;
      if (!container) return;

      let watermarked = makeWatermark();
      container.appendChild(watermarked);

      const callback = () => {
        cancel();
        container.removeChild(watermarked);

        watermarked = makeWatermark();
        container.appendChild(watermarked);
        cancel = observe(watermarked, callback);
      };

      let cancel = observe(watermarked, callback);

      return cancel;
    }, []);

    return <div ref={ref}>{props.children}</div>;
  }

  export function App() {
    return (
      <>
        <Watermark>
          <div className="cover">
            <h1>Hello World!</h1>
            <p>保护知识产权，防止未经允许被随意盗用</p>
            <p>保护公司机密信息，防止有心之人泄密</p>
          </div>
        </Watermark>
      </>
    );
  }
  ```
