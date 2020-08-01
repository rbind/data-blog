---
title: "Data Science Glossary"
slug: "/data-science-glossary"
date: 2020-07-31
description: "There are many complicated data science terms. Use this glossary to resarch terms from statistics, machine learning, and software engineering."
authorbox: true
sidebar: true
thumbnail: /img/glossary_avatar.png
---

<!--## Statistics Glossary-->

## Machine Learning Glossary

### Action {#estimate}

In [reinforcement learning](#reinforcement-learning), agents try to perform actions that maximize the [reward](#reward).
Each action changes the learning environment and thus yields a new [state](#state).

### Data Point {#data-point}

See [Observations](#observations).

### Dependent Variable {#estimate}

See [Feature](#feature).

### Estimate {#estimate}

See [Prediction](#prediction).

### Feature matrix

See [Features](#features).

### Features {#features}

Features are the dependent variables in a supervised learning scenario. The columns of a feature matrix,
$$X \in \mathbb{R}^{n \times p}\,$$
represent the values of the p features. For example, to predict the weather, two possible features are the level of precipitation
and the cloudiness.

The term *dependent variable* is synonymous to *feature* but more
frequently used in the statistical community.

### Feature Engineering {#feature-engineering}

[Supervised learning](#supervised-learning) aims at learning the general associations betwen [features](#features)
and [outcomes](#outcomes). However, in their original form, the input data are often not well-suited for this purpose.
Feature engineering is concerned with transforming the data such that machine learning models can easily
learn from the data.

### Forecasting {#forecasting}

See [Prediction](#prediction).

### Gold Standard {#gold-standard}

See [Ground Truth](#ground-truth).

### Ground Truth {#ground-truth}

In order to perform supervised learning, it is necesary that the [outcome](#outcomes) for each data point is known.
The measured outcome should reflect the ground truth. Otherwise, [models](#model) are optimized with respect
to the wrong values, aka *garbage in, garbage out*.

### Inference {#inference}

See [Prediction](#prediction).

### Interpretability {#interpretability}

Interpretability describes whether a model is able to produce results that humans can easily interpret.
Interpretability is closely tied to [model complexity](#model-complexity) (i.e. the effective numbers of model parameters). Simple models
such as linear models have few parameters and can easily be understood and interpreted. Complex models such as
deep neural networks have large numbers of parameters, which makes them hard to understand and interpret.

There are many application scenarios in which it is acceptable to sacrifice some predictive performance in
favor of greater interpretability. This is because in machine learning applications such as
decision support systems, it is key that human operators can understand the intentions of the model.

### Linear Model {#linear-model}

See [Model](#model).

### Machine Learning {#machine-learning}

Machine learning encompasses artificial intelligence approaches that are concerned with learning from data.
There are three machine learning areas: [supervised learning](#supervised-learning), [unsupervised learning](#unsupervised-learning),
and [reinforcement learning](#reinforcement-learning).

Once a [model](#model) has been fitted to the data,
it is possible to make [predictions](#prediction) given new data points (supervised learning), structure data (unsupervised learning),
or select optimal actions in a dynamic environment (reinforcement learning).

### Model {#model}

Models are the mathematical approximation of real-world phenomena. In [supervised learning](#supervised-learning), models are constructed using
pairs of input data and observed outcomes. In [unsupervised learning](#unsupervised-learning), the outcomes are not available such that only the structure
of the data is modeled. In [reinforcement learning](#reinforcement-learning), models are constructed according to states, actions, and rewards.

Besides these machine learning approaches, which use optimization algorithms to fit models to data, there is a host of
other models that are useful for specific tasks, for example, hidden Markov models, epidemiological models, and [Bayesian models](../tags/bayesian/).

It is possible to differentiate between linear and non-linear models. While linear models assume linear relationship between the
[features](#features), non-linear models assume non-linear relationships.

One should always remember the following famous quote from British statistican [George E.P. Box](https://en.wikipedia.org/wiki/George_E._P._Box):

> All models are wrong but some are useful.

### Model Complexity {#model-complexity}

Model complexity is defined by the effective numbers of parameters that make up a [model](#model).
For example, deep learning models with many parameters are more complex than simple models, such
as linear models. Complex models should be avoided if there are not sufficient training data available.

### Non-Linear Model {#non-linear-model}

See [Model](#model).

### Outcome {#outcomes}

In [supervised learning](#supervised-learning), the outcome is a measurement of the [ground truth](#ground-truth).
Principal types of outcomes are categorical outcomes (class labels) and quantitative outcomes. For example,
when predicting the weather, `Sunny` and `Cloudy` would be categorical outcomes, while the amount of precipitation
would be a quantitative outcome.

### Observations {#observations}

In [supervised learning](#supervised-learning), observations are the rows of the [feature matrix](#feature-matrix).
Observations are also called `data points` or `samples`. The number of observations is usually denoted by *N*.

For the use of the term *observation* in [reinforcement learning](#reinforcement-learning), see [State](#state).

### Policy {#policy}

In [reinforcement learning](#reinforcement-learning), the policy of an agent is a mapping from states to actions. This means
that the policy defines the behavior of the agent in the environment. There are *on-policy* and *off-policy* reinforcement learning
algorithms.

### Prediction {#prediction}

Prediction is the act of applying a [model](#model) on a new data point in order to determine the estimated [outcome](#outcomes).
Inference is often used synonymously, although [inference is geared towards learning about the data generation process](../post/commentary/inference-vs-prediction/). [Forecasting](../post/machine-learning/forecasting_vs_prediction/) is a special form of prediction in which time-series are used as the input.

The term *estimate* is a synonym for *prediction* that is popular in the statistical community because it underlines the fact
that predictions are only approximations of reality.

### Reinforcement Learning {#reinforcement-learning}

[Reinforcement learning](../tags/reinforcement-learning) (RL) is an area of machine learning in which one or multiple agents perform *actions* in an environment,
after observing the *state*. Once an action has been performed, the agent receives a *reward*. By balancing exploration (finding novel states) and
exploitation (reaping rewards), RL agents can learn an optimal [policy](#policy), which identifies the best action to take for every state.

In recent years, reinforcement learning has gained in popularity due to the emergence of deep RL, in which deep neural networks are used
to learn which states are associated with the greatest rewards.

### Reward {#reward}

In [reinforcement learning](#reinforcement-learning), agents obtain rewards after performing an [action](#action).
Agents adjust their [policy](#policy) in order to maximize the reward.

### State {#state}

In [reinforcement learning](#reinforcement-learning), the state indicates the observations that an agent has made at a given point in time.
States are usually represented by numeric vectors or matrices. Crafting appropriate states is a form of [feature engineering](#feature-engineering).

### Supervised Learning {#supervised-learning}

[Supervised learning](../tags/supervised-learning/) is an area of machine learning that is concerned with learning from pairs of input data and associated
[outcomes](#outcomes). Once a [model](#model) has been trained on a set of training data, it is tuned using a validation data set, and, finally, evaluated on an independent test data set.
The application of a supervised learning model on new data is called [prediction](#prediction), [inference](#inference), or [forecasting](#forecasting).

Models that are trained on labeled data (i.e. categorical outcomes) are called *classifiers* or *classification models*.
Models that are trained on quantitative outcomes are called *regressors* or *regression models*.

### Unsupervised Learning {#unsupervised-learning}

[Unsupervised learning](../tags/unsupervised-learning/) is an area of machine learning that is concerned with the identification of [models](#model)
that are capable to represent the properties of the data in a condensed manner, which allows for greater [interpretability](#interpretability).

Evaluating the performance of unsupervised learning methods is more challenging than for supervised learning because there are no outcomes
that provide the [ground truth](#ground-truth). Popular unsupervised methods include *k-means* and *PCA*.

<!--## Software Engineering Glossary-->
