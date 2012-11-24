#include "opencv2/objdetect/objdetect.hpp"
#include "opencv2/highgui/highgui.hpp"
 #include "opencv2/imgproc/imgproc.hpp"

 #include <iostream>
 #include <stdio.h>

 using namespace std;
 using namespace cv;

 /** Function Headers */
 std::vector<Rect> detectAndDisplay( Mat image );
 void stdoutJSONWriter (std::vector<Rect> faces, Mat image);

 /** Global variables */
 String face_cascade_name = "haarcascade_frontalface_alt.xml";
 CascadeClassifier face_cascade;
 RNG rng(12345);

 /** @function main */
 int main( int argc, const char** argv )
 {
   Mat image;
   std::vector<Rect> faces;

   //-- 1. Load the cascades
   if( !face_cascade.load( face_cascade_name ) ){ printf("--(!)Error loading\n"); return -1; };

   //-- 2. Read the video stream
    image = imread( argv[1] );

    //-- 3. Apply the classifier to the image
    if( !image.empty() )
    { faces = detectAndDisplay( image ); }
    else
    { printf(" --(!) No PICTURE found -- Break!"); return 1;}


    stdoutJSONWriter(faces, image);

   return 0;
 }

/** @function detectAndDisplay */
std::vector<Rect> detectAndDisplay( Mat image )
{
  std::vector<Rect> faces;
  Mat image_gray;

  cvtColor( image, image_gray, CV_BGR2GRAY );
  equalizeHist( image_gray, image_gray );

  //-- Detect faces
  face_cascade.detectMultiScale( image_gray, faces, 1.1, 2, 0|CV_HAAR_SCALE_IMAGE, Size(30, 30) );

  for( int i = 0; i < faces.size(); i++ )
  {
    Point center( faces[i].x + faces[i].width*0.5, faces[i].y + faces[i].height*0.5 );
    ellipse( image, center, Size( faces[i].width*0.5, faces[i].height*0.5), 0, 0, 360, Scalar( 255, 0, 255 ), 4, 8, 0 );
  }
  return faces;
}

void stdoutJSONWriter (std::vector<Rect> faces, Mat image)
{
  int id, x, y, width, height;
  int img_width, img_height, numfaces;

  img_width = image.cols;
  img_height = image.rows;
  numfaces = faces.size();

  // JSON Header
  cout << "{\n"
    "\"width\":" << img_width << " , "
    "\"height\":" << img_height << " , "
    "\"numfaces\":" << numfaces << " , "
    "\"faces\": [\n";

  // JSON element for each face
  for (int i = 0; i < faces.size(); ++i)
  {
    id = i;
    x = faces[i].x;
    y = faces[i].y;
    width = faces[i].width;
    height = faces[i].height;

    cout
    << "{ \"id\":" << id << " , "
    << "\"x\":" << x << " , "
    << "\"y\":" << y << " , "
    << "\"width\":" << width << " , "
    << "\"height\":" << height << " }";
    if (i+1 != faces.size()) { cout << ",";}
  }

  // JSON delimiter
  cout << "]\n}";
}
