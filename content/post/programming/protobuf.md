---
title: "The Essential Protobuf Guide for Python"
author: Matthias Döring
date: '2020-08-13'
description: "Protobuf is a data serialization format with favorable properties over JSON. Here, I explain how Protobuf can be used in Python projects."
lead: "Are you already making use of Protobuf for serializing your data? If you aren't, read this post to find out what you are missing out on!"
slug: "essential-protobuf-guide-python"
categories:
- software engineering
thumbnail: "/post/programming/protobuf_avatar.png"
downloadRmd: false
---
Protocol buffers (Protobuf) are a language-agnostic data serialization format developed by Google. Protobuf is great for the following reasons:

* **Low data volume:** Protobuf makes use of a binary format, which is more compact than other formats such as JSON.
* **Persistence:** Protobuf serialization is backward-compatible. This means that you can always restore previous data, even if the interfaces have changed in the meantime.
* **Design by contract:** Protobuf requires the specification of messages using explicit identifiers and types.
* **Requirement for gRPC:** gRPC (gRPC Remote Procedure Call) is an efficient remote procedure call system that makes use of the Protobuf format.

Personally, what I like best about Protobuf is that if forces developers to explicitly define the interfaces of an application.
This is a game-changer because it enables all stakeholders to understand and contribute to interface design.

In this post, I want to share my experiences using Protobuf in Python applications.

## Installing Protobuf

For most systems, Protobuf has to be installed from source. In the following, I describe the installation for Unix systems:

**1. Download a current Protobuf release from Git:**

```
wget https://github.com/protocolbuffers/protobuf/releases/download/v3.12.4/protobuf-all-3.12.4.tar.gz
```

**2. Extract the archive**

```
tar -xzf protobuf-all-3.12.4.tar.gz
```

**3. Install:**

```
cd protobuf-3.12.4/ && ./configure && make && sudo make install
```

**4. Verify installation (`protoc` should be available now!)**

```
protoc
```

Once the proto compiler is available, we can get started.

## 1. Definition of Protobuf Messages

To use Protobuf, we first need to define the messages that we would like to transmit. Messages are defined within `.proto` files.
Please consider the [official documentation](https://developers.google.com/protocol-buffers/docs/proto3) for the details of the protocol buffer language. Here, I will merely provide a simple example,
which is intended to showcase the most important language features.

Let's assume we are developing a social network like Facebook, which is all about people and their connections.
This is why we would like to model the message for a person.

A person has certain intrinsic traits (e.g. age, sex, height) but also certain extrinsic properties (e.g. friends, hobbies) that
we need to model. Let us store store the subsequent definitions under `src/interfaces/person.proto`:

```protobuf
syntax = "proto3";

import "generated/person_info.proto";

package persons;

message Person {
    PersonInfo info = 1; // characteristics of the person
    repeated Friend friends = 2; // friends of the person
}

message Friend {
    float friendship_duration = 1; // duration of friendship in days
    repeated string shared_hobbies = 2; // shared interests
    Person person = 3; // identity of the friend
}
```

Note that we are referencing another proto file, `generated/person_info.proto`, which we define as:

```protobuf
syntax = "proto3";

package persons;

enum Sex {
    M = 0; // male 
    F = 1; // female
    O = 2; // other
}

message PersonInfo {
    int32 age = 1; // age in years
    Sex sex = 2; 
    int32 height = 3; // height in cm
}
```

Don't worry if these definitions don't make sense to you yet, I will explain the most important keywords now:

* **syntax**: The syntax defines which version of Protobuf is used for the specification. We are using `proto3`.
* **import**: If a message is defined in terms of another message, you need to include that message using an `import` statement.
  You are probably wondering why `person.proto` imports `generated/person_info.proto` and not `interfaces/person_info.proto`?
  We will dive deeper into this later - for now just know that this is due to Python's import system. 
* **package**: Packages define messages that belong to the same namespace. This can prevent name clashes.
* **enum**: An enum defines an enumeration type.
* **messsage**: A message is the piece of information that we would like to model using Protobuf.
* **repeated**: The `repeated` keyword indicates a variable that is interpreted as a vector. In our case, `friends` is a vector of `Friend` messages.

Also note that each message attribute is assigned a unique number. This number is necessary for the backwards-compatibility of the protocol: once
a number has been assigned to a field, it should not be modified at a later point in time.

Now that we have the basic proto-definitions for our application, we can start generating the corresponding Python code.

## 2. Compilation of Proto Files

To compile proto files to Python objects, we are going to use the Protobuf compiler, `protoc`. 

We will call the proto compiler with the following options:

* `--python_out`: the directory under which the compiled Python files will be stored
* `--proto_path`: because the proto files are not in the root folder of the project, we need to use a substitution.
  By specifying `generated=./src/interfaces`, the compiler knows that we want to use the path to the generated files
  (`generated`) rather than the location of the interfaces (`src/interfaces`) when importing other proto messages.

With this understanding, we can compile the proto files like this:

```bash
mkdir src/generated
protoc src/interfaces/person_info.proto --python_out src/ --proto_path generated=./src/interfaces/
protoc src/interfaces/person.proto --python_out src/ --proto_path generated=./src/interfaces/
```

After executing these commands, the files `generated/person_pb2.py` and `generated/person_info_pb2.py` should exist. For example,
`person_pb2.py` looks like this:

```python
_PERSON = _descriptor.Descriptor(
  name='Person',
  full_name='persons.Person',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
...
```

The generated Python code is not really human-readable. But that doesn't matter because we just need
to know that `person_pb2.py` can be used to construct a serializable Protobuf object.

## 3. Serialization of Protobuf Objects

Before we can serialize our Protobuf object in a meaningful way, we need to fill it with some data.
Let's generate a person who has a single friend:

```python
# fill protobuf objects
import generated.person_pb2 as person_pb2
import generated.person_info_pb2 as person_info_pb2
############
# define friend for person of interest
#############
friend_info = person_info_pb2.PersonInfo()
friend_info.age = 40
friend_info.sex = person_info_pb2.Sex.M
friend_info.height = 165
friend_person = person_pb2.Person()
friend_person.info.CopyFrom(friend_info)
friend_person.friends.extend([])  # no friends :-(
#######
# define friendship characteristics
########
friendship = person_pb2.Friend()
friendship.friendship_duration = 365.1
friendship.shared_hobbies.extend(["books", "daydreaming", "unicorns"])
friendship.person.CopyFrom(friend_person)
#######
# assign the friend to the friend of interest
#########
person_info = person_info_pb2.PersonInfo()
person_info.age = 30
person_info.sex = person_info_pb2.Sex.M
person_info.height = 184
person = person_pb2.Person()
person.info.CopyFrom(person_info)
person.friends.extend([friendship])  # person with a single friend
```

Note that we filled all trivial data types (e.g. integers, floats, and strings) by direct assignment.
Only for more complex data types was it necessary to use some other functions.
For example, we made use of `extend` to fill repeated Protobuf fields and `CopyFrom` to fill Protobuf sub-messages.

To serialize the Protobuf object, we can use the `SerializeToString()` function. Additionally, we can also output Protobuf
objects as human-readable strings using the `str()` function:

```python
# serialize proto object
import os
out_dir = "proto_dump"
with open(os.path.join(out_dir, "person.pb"), "wb") as f:
    # binary output
    f.write(person.SerializeToString())
with open(os.path.join(out_dir, "person.protobuf"), "w") as f:
    # human-readable output for debugging
    f.write(str(person))
```

After executing the snippet, the generated, human-readable Protobuf message is available in `proto_dump/person.protobuf`:

```protobuf
info {
  age: 30
  height: 184
}
friends {
  friendship_duration: 365.1000061035156
  shared_hobbies: "books"
  shared_hobbies: "daydreaming"
  shared_hobbies: "unicorns"
  person {
    info {
      age: 40
      height: 165
    }
  }
}
```

Note that the person info shows neither the sex of the person nor the sex of the friend. This is not a bug but a feature of Protobuf:
entries with a value of `0` are never printed. So `sex` is not shown here because both persons are male, which is represented by `0`.

## 4. Automated Protobuf Compilation

During development, it can become tedious having to recompile the proto files after every change.
To automatically compile the proto files upon installation of a development Python package,
we can use the `setup.py` script.

Let's create a function that generates the Protobuf code for all `.proto` files in the `src/interfaces` directory and stores them under `src/generated`:

```python
import pathlib
import os
from subprocess import check_call

def generate_proto_code():
    proto_interface_dir = "./src/interfaces"
    generated_src_dir = "./src/generated/"
    out_folder = "src"
    if not os.path.exists(generated_src_dir):
        os.mkdir(generated_src_dir)
    proto_it = pathlib.Path().glob(proto_interface_dir + "/**/*")
    proto_path = "generated=" + proto_interface_dir
    protos = [str(proto) for proto in proto_it if proto.is_file()]
    check_call(["protoc"] + protos + ["--python_out", out_folder, "--proto_path", proto_path])
```

Next, we need to overwrite the `develop` command such that the function is called each time that the package is installed:

```python
from setuptools.command.develop import develop
from setuptools import setup, find_packages

class CustomDevelopCommand(develop):
    """Wrapper for custom commands to run before package installation."""
    uninstall = False

    def run(self):
        develop.run(self)

    def install_for_development(self):
        develop.install_for_development(self)
        generate_proto_code()

setup(
    name='testpkg',
    version='1.0.0',
    package_dir={'': 'src'},
    cmdclass={
        'develop': CustomDevelopCommand, # used for pip install -e ./
    },
    packages=find_packages(where='src')
)
```

The next time we run `pip install -e ./` the Protobuf files are automatically generated within `src/generated`. 

## How much space are we saving?

Earlier, I mentioned that one of Protobuf's advantages is its binary format. Here, we will consider this advantage
by comparing the size of the Protobuf message for `Person` with the corresponding JSON:

```json
"person": {
    "info": {
      "age": 30,
      "height": 184
    },
    "friends": {
      "friendship_duration": 365.1000061035156,
      "shared_hobbies": ["books", "daydreaming", "unicorns"],
      "person": {
        "info": {
          "age": 40,
          "height": 165
        }
      }
    }
}
```

Comparing the JSON and Protobuf text representation, it turns out that JSON is actually more compact because its list representation is more concise.
This, however is misleading, because we are interested in the binary Protobuf format.

When we compare the number of bytes that are consumed by the binary Protobuf and JSON for the `Person` object, we find the following:

```bash
du -b person.pb
53      person.pb

du -b person.json 
304     person.json
```

### Here, Protobuf is 5 Times Smaller than JSON

The binary Protobuf (53 bytes) is **more than 5 times smaller** than the corresponding JSON (304 bytes).
Note that we can only achieve this level of compression if we are transmitting binary Protobuf using the gRPC protocol.

If gRPC is not an option, a common pattern is to encode the binary Protobuf data using the base64-encoding.
Although this encoding irrevocably increases the size of the payload by 33%, it is still much smaller than the corresponding REST payload.

## Summary

Protobuf is an ideal format for data serialization. It's much smaller than JSON and allows for the explicit definition of interfaces.
Due to its favorable properties, I would recommend the use of Protobuf in all projects that make use of sufficiently complex
data. Although Protobuf requires an initial investment of time, I'm sure that it pays off quickly.

All of the presented code is also [available via GitHub](https://github.com/matdoering/python-proto).

What do you think about Protobuf? In which situations do you use it?

