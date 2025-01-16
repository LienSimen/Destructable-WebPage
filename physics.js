// Matter.js Aliases
const { Engine, Render, Runner, Bodies, World, Events } = Matter;

// Set up the physics engine
const engine = Engine.create();
const world = engine.world;

// Create the renderer
const canvas = document.getElementById("gameCanvas");
const render = Render.create({
  canvas,
  engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false, // Keep elements styled naturally
    background: "#f0f0f0",
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Add ground and walls
const ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight,
  window.innerWidth,
  50,
  { isStatic: true }
);
const leftWall = Bodies.rectangle(
  0,
  window.innerHeight / 2,
  50,
  window.innerHeight,
  { isStatic: true }
);
const rightWall = Bodies.rectangle(
  window.innerWidth,
  window.innerHeight / 2,
  50,
  window.innerHeight,
  { isStatic: true }
);
World.add(world, [ground, leftWall, rightWall]);

// Create a stick figure
const stickFigure = Bodies.rectangle(200, 300, 30, 50, {
  label: "stickFigure",
  restitution: 0.5,
});
World.add(world, stickFigure);

// Add keyboard controls for the stick figure
document.addEventListener("keydown", (event) => {
  const force = 0.02;
  if (event.key === "ArrowUp") {
    Matter.Body.applyForce(stickFigure, stickFigure.position, {
      x: 0,
      y: -force,
    });
  } else if (event.key === "ArrowLeft") {
    Matter.Body.applyForce(stickFigure, stickFigure.position, {
      x: -force,
      y: 0,
    });
  } else if (event.key === "ArrowRight") {
    Matter.Body.applyForce(stickFigure, stickFigure.position, {
      x: force,
      y: 0,
    });
  }
});

// Attach physics to HTML elements with the .destroyable class
const destroyables = document.querySelectorAll(".destroyable");
destroyables.forEach((el) => {
  const rect = el.getBoundingClientRect();
  const body = Bodies.rectangle(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    rect.width,
    rect.height,
    {
      label: "destroyable",
      isStatic: true, // Initially static
      render: { fillStyle: "transparent" }, // Keep rendering invisible
    }
  );
  World.add(world, body);

  // Change the element's physics state on collision
  Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((pair) => {
      if (pair.bodyA === body || pair.bodyB === body) {
        Matter.Body.setStatic(body, false);
      }
    });
  });

  // Synchronize HTML element position with the physics body
  Events.on(engine, "afterUpdate", () => {
    const pos = body.position;
    el.style.position = "absolute";
    el.style.left = `${pos.x - rect.width / 2}px`;
    el.style.top = `${pos.y - rect.height / 2}px`;
  });
});

// Resize canvas dynamically
window.addEventListener("resize", () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  Matter.Body.setPosition(ground, {
    x: window.innerWidth / 2,
    y: window.innerHeight,
  });
});
