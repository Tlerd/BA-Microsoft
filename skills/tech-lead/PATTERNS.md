# Pattern review

A pattern earns its place when it removes a cost the code has today. Start from the symptom in the code, then pick the pattern. Write the plain version when only one variant exists.

## Steps

1. **List the symptoms** in the code under review, with file and line, using the table below.
2. **Count the variants** for each symptom: how many implementations exist today, and how many the accepted requirements add. One variant means plain code. Two or more means a pattern.
3. **Name the language feature first.** A function parameter often replaces Strategy or Command. A framework container often replaces Singleton and Factory. Use the framework's own mechanism when it has one.
4. **Report** each finding: symptom, location, variant count, recommended change, and the plain alternative.

Done when every symptom in the code has a finding, and each recommended pattern has at least two variants.

## Symptoms and patterns

| Symptom in the code | Pattern | Plain alternative |
|---|---|---|
| A `switch` or `if` on a type picks an algorithm in two or more places | Strategy | A map from key to function |
| Many `if` checks on a status decide which actions are allowed | State, or a transition table | A transition table in one module, enforced by the database |
| A constructor with many optional parameters | Builder | An options object with defaults |
| A third-party SDK whose API differs from your port | Adapter | None: wrap every external service |
| A caller must call several services in a fixed order | Facade, or an application service | One use-case function |
| Logging, cache, retry, or metrics around an existing call | Decorator, or framework middleware or interceptor | Middleware of the framework |
| Several modules react when one event happens | Observer, or domain events with an outbox | A direct call when only one reacts |
| An action must be queued, retried, or undone | Command | A job record in a queue table |
| `new` of a concrete class spread over the code | Dependency injection, Factory | The framework container |
| A tree where a leaf and a group are used the same way | Composite | Recursion on plain data |

## Rules

- A Singleton is shared global state. Register one instance in the container and inject it.
- Observer calls its listeners directly. Publish-subscribe has a broker between the sides, so the sender does not know the receivers.
- An interface with one implementation and no test double is a pass-through. Delete it or inline it.
