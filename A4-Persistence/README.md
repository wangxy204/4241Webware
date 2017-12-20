Author: Xinyuan Wang

Assignment 4

This is the new Movie Search

You can add movie you want
You can remove the movie that exist in the list, if the movie does not exist in the list, it will pop up the window and tell you the movie is not found.

if you direct click add or remove it will tell you proper info

About challenge:

I Consider the pop up window as the technical challenge. Also, I used JSON file for the movie list. I also consider this as the challenge part. In addition, the file can be dynamic showed.
I search the return number and use:
```
res.writeHead(302, {'Location': '/'})
```
to return back to the page

About theme and style:

I chose this background so that it fits the green button and the title color. In my opinion, other background color will only makes the web page messy.
It's kind of simple But I think it's just the style I want. I also used some materialize icon in the button so that the information looks more obvious.
used google font to change the title



part of the code:
```
if (movies.indexOf(POST.remove) == -1) {
                    sendIndex(res, movies, true);

                } else {
                    movies = movies.filter(function (e) {
                        return POST.remove != e
                    });

                    fs.writeFile('movies.txt', JSON.stringify(movies), function () {
                        console.log('done')
                ```

Another part of:
```
         if (POST.adding) {
                var movies = read();
                movies.push(POST.adding);
                fs.writeFileSync('movies.txt', JSON.stringify(movies));
                console.log(POST.adding)
                res.writeHead(302,{'Location':'/'})
                res.end()
            }
```