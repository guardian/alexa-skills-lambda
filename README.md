Alexa Guardian Skill
==================== 

### Introduction

Alexa is an Amazon Echo application which allows users to query a part of the Guardian content through Echo. 	

### Glossary 

Here we clarify some of the terms around Alexa. 

**Intent**: Events that we define in response to something the user say. There are two kinds of Intents: those that are standard and defined by Amazon, and application related events. 

**Slot Types**: Are the *things* in the context of the application. For instance, in our case, categories of news or categories of podcasts. 

**Utterances**: Essentially define the grammar structure of the interaction with Alexa. If intents can be seen as verbs and slot types as nouns, then Utterances define grammatically correct sentences.

**Cards**: Cards are textual informations send to Alexa as metadata of some requests answers. 

Architecture
------------

```
 [Human]
    |
    | 
 [Echo device]
    |
    |
 [Amazon Echo Service (Alexa)]
    | 
    |
 [AWS lambda Implementing the Guardian Skill] + [Interaction Model]
    |           |             |
    |           |             |
 [CAPI]    [ DynamoDB ]    [Ophan]
```

### What is the Interaction Model ?

The "Interaction Model" is the part of the system that resides on the AWS developer account Skill Configuration page. It is made of *Intents*, *Slot Types* and *Utterances*, which have been defined in the Glossary. Otherwise see the section *Current Limitations* for the effects of this set up. 

### Which state do we have ?

The echo service maintains a state during a single "session". A session in this context is an exchange during which the user is going to navigate towards a single piece of content. The actual session data is passed by the Echo Service 

The other state maintained by the collection is held in the DynamoDB. We maintain: 

- A log of the visits/usage, and 
- The url and millisecond-offset of the podcast currently being played.

The communication between the lambda and Ophan powers the [Alexa dashboard page](https://dashboard.ophan.co.uk/top20?hours=24&platform=amazon-echo).


Tech Stack
------------

Because the Echo device and the Amazon Echo Service are owned by Amazon, the focus of our development is the creation of the AWS lambda. Our tech stack consists in 

- JavaScript: that the AWS lambda is written in.
- DynamoDB: To wrote visit/usage information and metadata on the podcasts being played.
- The AWS Echo SDK: for the communication between the lambda and the Echo service. 


Running Locally
---------------

### Prerequisites

To run Alexa locally, make sure that you have the following dependencies installed: 

- [nvm](https://github.com/creationix/nvm).

Run `nvm install` to install and use the correct node version.


### Running the tests

You can now run `node test` to run the unit tests. 


Deploying
---------

Deployment is done with Riff-Raff. 

- project: `content-api::alexa-skills-lambda`
- stage: `CODE` or `PROD`


Amazon Developer Account
------------------------

In order to access the online configuration panel for Alexa, you need to create a AWS account (with your Guardian email account). Then ask somebody in the team to add you. 

To add somebody to the team:

- Be an existing member with admin access. 
- Sign in and once on the main dashboard go to [Settings]
- Choose the sub menu [User permissions] and then click on [Add New]


Amazon Certification Process
----------------------------

The Amazon Certification Process is the mechanism by which newer versions of the Skill configuration (aka "Interaction Model") are sent for approval. Submitting a new version of the configuration is done through your Amazon Developer Account.


Current Limitations
-------------------

1. Update the interaction model can only be done through the developer account. Having to make this update through the developer account (and not via an API) makes the process manual, and error prone.

2. The actual audio testing needs to be done against the Echo device.

3. We currently cannot accurately/richly search for tags by different aliases meaning we currently have tags and their aliases hard coded in the application.

4. The Amazon Certification process doesn't work well with the team's workflow. We typically deliver incremental changes fast which directly conflicts with Amazon's desire to test and screen all of our changes prior to them being released.

5. Amazon imposes a limit of 8000 chars on articles. We get capi to filter using max-char-count. Where we use editors-picks, we have to manually filter out results based on their charCount.


Updating Intents, Slot Types and Utterances
-------------------------------------------

The update of those configuration items is done through the Amazon Developer Account. Note that we typically perform them after submitting a PR and merging.


 




