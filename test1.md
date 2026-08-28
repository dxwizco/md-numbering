# Markdown Heading Numbering — Full Test Cases <!-- skip -->

Basic numbering

# L-1

## L-2

### L-3

#### L-4

##### L-5

###### L-6

# L-1

## L-2

skip-all

## L-2 Should skip this heading and all descendants <!-- skip-all -->

### L-3 Should skip

##### L-5 Should skip

##### L-5 Should skip

###### L-6 Should skip

## L-2

### L-3

#### L-4

skip

### L-3 skipped <!-- skip -->

#### L-4

##### L-5

###### L-6

###### L-6

##### L-5

###### L-6

##### L-5

### L-3

#### L-4

##### L-5

###### L-6

Multiple skipped levels

# L-1

#### L-4

##### L-5

###### L-6

#### L-4

##### L-5

skip followed by sibling

# L-1

## L-2 skipped <!-- skip -->

## L-2

### L-3

skip-all followed by sibling

# L-1

## L-2 skip-all <!-- skip-all -->

### L-3 Should skip

#### L-4 Should skip

##### L-5 Should skip

## L-2

### L-3

skip-all with deeper levels

# L-1

## L-2 skip-all <!-- skip-all -->

### L-3 Should skip

#### L-4 Should skip

##### L-5 Should skip

## L-2

#### L-4

##### L-5

Consecutive skip headings

# L-1

## L-2 skipped <!-- skip -->

### L-3 skipped <!-- skip -->

#### L-4

##### L-5

Root-level skip

# L-1 skipped <!-- skip -->

## L-2

### L-3

#### L-4

Root-level skip-all

# L-1 skip-all <!-- skip-all -->

## L-2 Should skip

### L-3 Should skip

#### L-4 Should skip

# L-1

## L-2

Document without H1

### L-3

#### L-4

### L-3

##### L-5

###### L-6

Deep nesting and returning to higher levels

# L-1

###### L-6

## L-2

##### L-5

### L-3

###### L-6

#### L-4

## L-2

skip-all at different levels

# L-1

### L-3 skip-all <!-- skip-all -->

#### L-4 Should skip

##### L-5 Should skip

###### L-6 Should skip

### L-3

#### L-4

skip at different levels

# L-1

### L-3 skipped <!-- skip -->

#### L-4

##### L-5

### L-3

#### L-4

skip-all with no children

# L-1

## L-2 skip-all <!-- skip-all -->

## L-2

Invalid heading levels

# L-1

## L-2

####### Not a Level

### L-3

#### L-4

####### Still Not a Level

##### L-5

Combined realistic case

# L-1

## L-2

### L-3 skipped <!-- skip -->

#### L-4

##### L-5

## L-2 skip-all <!-- skip-all -->

### L-3 Should skip

#### L-4 Should skip

###### L-6 Should skip

## L-2

#### L-4

##### L-5

### L-3

#### L-4

# L-1

#### L-4

##### L-5

###### L-6

#### L-4

##### L-5

###### L-6

## L-2

### L-3 skipped <!-- skip -->

#### L-4

##### L-5

###### L-6

# L-1

#### L-4
