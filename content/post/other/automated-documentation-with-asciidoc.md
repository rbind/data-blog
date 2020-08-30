---
title: "Automating the Documentation of ML Experiments using Python and AsciiDoc"
lead: "Unsure how to document ML experiments? Why not give AsciiDoc a try?"
author: Matthias Döring
date: '2020-08-30'
description: "Machine-learning experiments need to be documented. Here, I show an approach that combines AsciiDoc with Python template strings."
thumbnail: "post/other/automated-documentation-with-asciidoc_avatar.jpg"
slug: "documenting-experiments-asciidoctor-python"
downloadRmd: false
categories:
  - other
tags:
  - Python
  - Documentation
---
In this post, I want to share how Python can be used to automate the documentation of machine-learning (ML) experiments
using AsciiDoc.

The search for the best-performing ML model is an empirical process, which involves
fitting models with differing parameters and evaluating their predictive performance.
Only after a multitude (e.g. hundreds or thousands) of models have been evaluated,
is it possible confidently proclaim that a suitable model has been identified.
The major challenge of running vast numbers of experiments is that they are time- and compute-intensive because
results usually have to be delivered within a certain time frame (e.g. weeks) and
compute resources are often limited due to budgets constraints.

The challenge of documenting the experiments, however, is often overlooked
although a thorough documentation is critical to ensure reproducibility and extraction
of knowledge from experiments. In my opinion, the following pieces of information
should be documented for every ML experiment:

* The person(s) that are responsible for the experiment.
* The motivation/hypothesis for the experiment: why was a certain method / a certain set of parameters selected?
* Performance indicators for the experiments. Most importantly, the predictive performance should be
  reported. Other aspects such as interpretability, fairness, and computational performance may also be relevant.
* A discussion of the results, e.g., why the performance was lower/higher than expected and how the results
  influence the direction of future experiments.

Now that we know what we would like to document, what remains to answer is the question how the documentation
can be generated. Since we don't want to manually document each experiment, a [docs-as-code approach](https://docs-as-co.de/)
seems to be the most fitting technique in order to automate the process.

In short, the idea of docs-as-code is that the documentation
should be a part of the code base such that it is easily accessible and maintained by the development team.
By keeping the documentation close to the code it is also possible to include references to
code snippets or configuration files in the documentation without the need for any duplicated content.
The two main technologies for the implementation of docs-as-code are [Markdown](https://www.markdownguide.org/) and
[AsciiDoc](https://asciidoc.org/). Here, we will use AsciiDoc due to its greater
ease of use when it comes to elements such as tables.

In the following sections of this post, I will answer the following questions:

* How to include the configuration files for ML experiments within AsciiDoc?
* How to automatically document the results of ML experiments?

The following documentation example is based on a multi-agent reinforcement-learning problem for Pacman in which
we are interested in finding an optimal agent policy given states, actions, and rewards.

## Documenting Configuration Files via AsciiDoc

There are various file formats that can be used to configure software such as
json, yaml, ini, or toml. Here, we will showcase how a json configuration file
can be included in the AsciiDoc documentation.

Let's assume that we have configured our experiment using the file `config.json` in the following way:

```json
{
    "state": "ScreenImage",
    "actions": ["Up", "Down", "Left", "Right"],
    "reward": "Score",
    "model": "Q-Learning",
    "learning_rate": 0.1,
    "discount_factor": 0.9
}
```

To include this file in the documentation, we can use the the AsciiDoc `include` command within `template.adoc`:

```asciidoc
== Configuration

include::config.json[]
```

The file can be rendered using 

```
asciidoctor template.adoc
```

After running the command, we obtain the following HTML result:

![](/post/other/asciidoc_config.png)

Note that the benefit of this approach is that the documentation will always be up-to-date
with the configuration because it merely references the json file.

## Automating the Documentation of Experiment Results

Manually documenting the results of ML experiments is laborious and error-prone. To automatically
include the experiment results in our AsciiDoc template file, we add template variables to the `template.adoc` file
and use Python to implement a logic for filling the variables.

### Extending the Documentation Template

The documentation template defines the basic composition of the experiment documentation.
To document the results, we introduce variables that are prefixed by a dollar-symbol, which will be substituted
by an additional processing step.

Assume that we want to document the rewards of multiple reinforcement-learning agents in a table.
To store this table, we will add the following lines to `template.adoc`:

```asciidoc
== Results

=== Results per Agent

$reward_agents_table
```

Now we just need to write some code to substitute the `$rewards_agent_table` variable with the actual results.

### Logic for Variable Substitution

To fill the variables in our AsciiDoc template file, we will use [Python template strings](https://docs.python.org/3.4/library/string.html#template-strings), which can be used to substitute identifiers prefixed with `$`.

The following function performs a substitution on a file, `template_fname`, using the dictionary `col_entries`: 

 
```python
from string import Template

def substitute(template_fname, col_entries):
    """Substitutes the input variables in the specified file.
    Stores the result in an output file with the name 'result.adoc.'.

    Args:
        template_fname (str): Filename of the AsciiDoc template file for which vars should be replaced.
        col_entries (dict): mapping from column names to list of column entries
    """
    substitutions = {}
    vars = ["reward_agents_table"]
    for var in vars:
        substitutions[var] = create_substitution_for(var, col_entries)

    template = Template(open(template_fname).read())
    report = template.substitute(substitutions)
    with open("result.adoc", "w") as out_file:
        out_file.write(report)
```

The function executes the following steps:

1. Definition of the of the AsciiDoc strings that shall be used to replace the variables defined in
`vars` via `substitutions`.
2. Definition of the AsciiDoc template file in which the variables shall be replaced.
3. Variable substitution (`report` variable)
4. Storing the substituted AsciiDoc file (`out_file.write(report)`)

Note that the function `create_substitution_for()`, which generates the text that replaces the
variable, `var`, that is passed as an argument still has to be implemented. In our case, the implementation
of this function will generate a simple AsciiDoc table based on the `col_entries` dict:

```python
def create_substitution_for(var, col_entries):
    """Generates the substitution text for the input variable.

    Args:
        var (str): name of the variable to be replaced
        col_entries (dict): mapping from column names to list of column entries

    Returns:
        str: text that shall replace the variable
    """
    if var == "reward_agents_table":
        return build_adoc_table_from_dict(col_entries)
    else:
        print(f"Warning: No substitution implemented for variable '{var}'.")
        return ""

def build_adoc_table_from_dict(col_entries: dict) -> str:
    """Creates an adoc table from a dictionary.

    Args:
        col_entries (dict[str]): Dictionary with a list of values for the column names.

    Returns:
        str: An adoc table as a string.
    """
    # sort columns
    columns = list(col_entries.keys())
    columns.sort()
    # generate the header
    header: str = f'|{" |".join(columns)}'
    # create the table content
    n_rows = len(list(col_entries.values())[0])
    rows = []

    for row_i in range(n_rows):
        row = ""
        for column in columns:
            value = col_entries[column][row_i]
            row += f'|{value}\n'
        rows.append(row)
    table_content = '\n'.join(rows)

    # store the table
    adoc_table = f'|===\n{header}\n\n{table_content}\n|==='
    return adoc_table
``` 

### Performing the Variable Substitution

To perform the variable substitution, we just have to call `substitute` with the desired arguments:

```python
# data for replacing "rewards_agent_table"
col_entries_agents = {'agent': ['Pacman_0', 'Pacman_1', 'Pacman_2'],
                      'policy_reward_max': ['12.0', '24.0', '23.0'],
                      'policy_reward_mean': ['11.15', '23.81', '21.75'],
                      'policy_reward_min': ['9.0', '21.0', '12.0']
                     }

substitute('template.adoc', col_entries_agents)
```

After substituting the variable, the content of `result.adoc` contains a table with
the agent results rather than the `$reward_agents_table` variable.

```asciidoc
= Experiment Documentation

== Configuration

include::config.json[]

== Results

=== Results per Agent

|===
|agent |policy_reward_max |policy_reward_mean |policy_reward_min

|Pacman_0
|12.0
|11.15
|9.0

|Pacman_1
|24.0
|23.81
|21.0

|Pacman_2
|23.0
|21.75
|12.0

|===
```
 
The final result, as rendered via `asciidoctor result.adoc`, contains a nicely rendered table with
the agent results:

![](/post/other/asciidoc_result.png)

## Summary

By combining Python template strings with AsciiDoc, it is easily feasible to automate
the documentation of ML experiments. Additionally, the docs-as-code approach ensures that
that the development team actively maintains the documentation and allows for tracking
documentation changes via version control.

Note that further automatization is possible, e.g., by including [pyplot](https://matplotlib.org/api/pyplot_api.html[pyplot]) visualizations that indicate model performance.

The code for generating the documentation that is described here is available via [GitHub](https://github.com/matdoering/asciidoc-variable-substitution).
